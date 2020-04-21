import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { getLang } from 'ctrl/hall/hallCtrlUtil';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { AudioRes } from 'data/audioRes';
import { Config, SkillMap } from 'data/config';
import { InternationalTip } from 'data/internationalConfig';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { getBeBombFish } from 'model/game/fish/fishModelUtils';
import { BombModel } from 'model/game/skill/bombModel';
import { FreezeModel } from 'model/game/skill/freezeModel';
import { LockActiveData, LockFishModel } from 'model/game/skill/lockFishModel';
import { SkillStatus } from 'model/game/skill/skillCoreCom';
import { SkillModel } from 'model/game/skill/skillModel';
import { offMouseMove, onMouseMove } from 'utils/layaUtils';
import AlertPop from 'view/pop/alert';
import ShopPop from 'view/pop/shop';
import TopTipPop from 'view/pop/topTip';
import {
    activeAim,
    activeAimFish,
    stopAim,
} from 'view/scenes/game/ani_wrap/aim';
import { activeExploding } from 'view/scenes/game/ani_wrap/exploding';
import {
    offFishClick,
    onFishClick,
    onPoolClick,
    viewState,
} from 'view/viewState';
import { getAimFish, modelState } from 'model/modelState';

/** 技能的激活前的处理 */
export function skillPreActiveHandler(model: SkillModel) {
    const lang = getLang();
    const { buySkillTip, posBombTip, aimFish } = InternationalTip[lang];
    if (model.skill_core.num <= 0) {
        AlertPop.alert(buySkillTip).then(type => {
            if (type === 'confirm') {
                ShopPop.preEnter();
            }
        });
        return;
    }
    if (model.skill_core.status !== SkillStatus.Normal) {
        return;
    }
    model.skill_core.setStatus(SkillStatus.PreActive);

    if (model instanceof FreezeModel) {
        // 冰冻
        const socket = getSocket(ServerName.Game);
        socket.send(ServerEvent.UseFreeze);
    } else if (model instanceof BombModel) {
        TopTipPop.tip(posBombTip, 2);
        const { pool } = viewState.game;
        const { PoolWidth, PoolHeight } = Config;
        activeAim({ x: PoolWidth / 2, y: PoolHeight / 2 });
        onMouseMove(pool, pos => activeAim(pos));

        // 炸弹
        onPoolClick().then((pos: Point) => {
            offMouseMove(pool);
            stopAim('aim_big');
            const socket = getSocket(ServerName.Game);
            const fish_list = getBeBombFish(pos);
            socket.send(ServerEvent.UseBomb, {
                bombPoint: pos,
                fishList: fish_list,
            } as UseBombReq);
        });
    } else if (model instanceof LockFishModel) {
        const fish = getAimFish();
        const player = modelState.app.game.getCurPlayer();

        TopTipPop.tip(aimFish, 2);
        activeAimFish(fish, false, player.gun.pos);
        // 选中鱼
        onFishClick().subscribe((fish_id: string) => {
            const socket = getSocket(ServerName.Game);
            socket.send(ServerEvent.UseLock);
            socket.send(ServerEvent.LockFish, {
                eid: fish_id,
            } as LockFishReq);
        });
    }
}

/** 技能的激活的处理 */
export function skillActiveHandler(
    model: SkillModel,
    info: any,
    is_cur_player?: boolean,
) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Game);
        const lang = getLang();
        const { aimFish } = InternationalTip[lang];
        if (model instanceof LockFishModel) {
            if (!is_cur_player) {
                return;
            }
            const { fish, is_tip, gun_pos } = info as LockActiveData;
            if (is_tip) {
                // 激活锁定之后 提示选中鱼 选中之后发给服务器...
                TopTipPop.tip(aimFish, 2);
            }
            const fire = !is_tip;
            activeAimFish(fish, fire, gun_pos);

            // 选中鱼
            onFishClick().subscribe((fish_id: string) => {
                socket.send(ServerEvent.LockFish, {
                    eid: fish_id,
                } as LockFishReq);
            });
            // ...
        } else if (model instanceof BombModel) {
            const { pool } = viewState.game;
            activeExploding(info as Point);
            offMouseMove(pool);
            AudioCtrl.play(AudioRes.Bomb);
            resolve();
        }
    });
}

/** 技能的disabled处理 */
export function skillDisableHandler(model: SkillModel) {
    return new Promise((resolve, reject) => {
        if (model instanceof LockFishModel) {
            stopAim('aim');
            offFishClick();
        } else {
            resolve();
        }
    });
}
