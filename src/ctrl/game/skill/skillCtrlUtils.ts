import { SkillModel } from 'model/game/skill/skillModel';
import {
    onPoolClick,
    onFishClick,
    offFishClick,
    viewState,
} from 'view/viewState';
import { FreezeModel } from 'model/game/skill/freezeModel';
import { BombModel } from 'model/game/skill/bombModel';
import {
    TrackFishModel,
    TrackActiveData,
} from 'model/game/skill/trackFishModel';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { activeExploding } from 'view/scenes/game/ani_wrap/exploding';
import { SkillStatus } from 'model/game/skill/skillCoreCom';
import TopTipPop from 'view/pop/topTip';
import { Config } from 'data/config';
import {
    activeAim,
    stopAim,
    activeAimFish,
} from 'view/scenes/game/ani_wrap/aim';
import { getBeBombFish } from 'model/game/fish/fishModelUtils';
import AlertPop from 'view/pop/alert';
import ShopPop from 'view/pop/shop';
import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from 'data/audioRes';
import { Laya } from 'Laya';
import { Event } from 'laya/events/Event';
import { onMouseMove, offMouseMove } from 'utils/layaUtils';
import { getLang } from 'ctrl/hall/hallCtrlUtil';
import { InternationalTip } from 'data/internationalConfig';

/** 技能的激活前的处理 */
export function skillPreActiveHandler(model: SkillModel) {
    const lang = getLang();
    const { buySkillTip, posBombTip } = InternationalTip[lang];
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
            stopAim('aim_big');
            const socket = getSocket(ServerName.Game);
            const fish_list = getBeBombFish(pos);
            socket.send(ServerEvent.UseBomb, {
                bombPoint: pos,
                fishList: fish_list,
            } as UseBombReq);
        });
    } else if (model instanceof TrackFishModel) {
        const socket = getSocket(ServerName.Game);
        // 激活锁定
        socket.send(ServerEvent.UseLock);
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
        if (model instanceof TrackFishModel) {
            if (!is_cur_player) {
                return;
            }
            const { fish, is_tip, gun_pos } = info as TrackActiveData;
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
        if (model instanceof TrackFishModel) {
            stopAim('aim');
            offFishClick();
        } else {
            resolve();
        }
    });
}
