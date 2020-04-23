import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { getLang } from 'ctrl/hall/hallCtrlUtil';
import { AudioRes } from 'data/audioRes';
import { Config } from 'data/config';
import { InternationalTip } from 'data/internationalConfig';
import { ServerEvent } from 'data/serverEvent';
import { getBeBombFishIds } from 'model/game/fish/fishModelUtils';
import { BombModel } from 'model/game/skill/bombModel';
import { FreezeModel } from 'model/game/skill/freezeModel';
import { LockActiveData, LockFishModel } from 'model/game/skill/lockFishModel';
import { SkillStatus } from 'model/game/skill/skillCoreCom';
import { SkillModel } from 'model/game/skill/skillModel';
import { getAimFish, modelState } from 'model/modelState';
import { offMouseMove, onMouseMove, onNode } from 'utils/layaUtils';
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
    offPoolClick,
    viewState,
} from 'view/viewState';
import { sendToGameSocket } from '../gameSocket';
import { onKeyBoardEvent, onNodeEvent } from 'utils/rxUtils';
import { Sprite } from 'laya/display/Sprite';
import { Event } from 'laya/events/Event';
import { merge } from 'rxjs';

/** 二次点击取消激活状态 */
export function skillNormalActiveHandler(model: SkillModel) {
    if (model.skill_core.status !== SkillStatus.PreActive) {
        return;
    }
    model.skill_core.setStatus(SkillStatus.Normal);
    if (model instanceof LockFishModel) {
        offFishClick();
        TopTipPop.hide();
        stopAim('aim');
    }
    if (model instanceof BombModel) {
        TopTipPop.hide();
        stopAim('aim_big');
        offPoolClick();
    }
}
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
    /** 二次点击取消激活状态 */
    if (model.skill_core.status !== SkillStatus.Normal) {
        return;
    }
    model.skill_core.setStatus(SkillStatus.PreActive);

    if (model instanceof FreezeModel) {
        // 冰冻
        sendToGameSocket(ServerEvent.UseFreeze);
    } else if (model instanceof BombModel) {
        TopTipPop.tip(posBombTip, 2);
        const { pool } = viewState.game;
        const { PoolWidth, PoolHeight } = Config;
        activeAim({ x: PoolWidth / 2, y: PoolHeight / 2 });
        onMouseMove(pool, pos => activeAim(pos));

        // 炸弹
        onPoolClick(true).subscribe((pos: Point) => {
            offMouseMove(pool);
            stopAim('aim_big');
            const fish_list = getBeBombFishIds(pos);
            sendToGameSocket(ServerEvent.UseBomb, {
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
        onFishClick(true).subscribe((fish_id: string) => {
            sendToGameSocket(ServerEvent.LockFish, {
                eid: fish_id,
                needActive: true,
            } as LockFishRep);
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
                sendToGameSocket(ServerEvent.LockFish, {
                    eid: fish_id,
                } as LockFishRep);
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
        } else if (model instanceof BombModel) {
            offPoolClick();
        } else {
            resolve();
        }
    });
}

export function getShortcut(model: SkillModel) {
    if (model instanceof LockFishModel) {
        return 'F1';
    } else if (model instanceof FreezeModel) {
        return 'F2';
    } else if (model instanceof BombModel) {
        return 'F3';
    }
}

export function onTrigger(model: SkillModel, view: Sprite) {
    let code = 112;
    if (model instanceof LockFishModel) {
        code = 112;
    } else if (model instanceof FreezeModel) {
        code = 113;
    } else if (model instanceof BombModel) {
        code = 114;
    }
    const observer_keyboard = onKeyBoardEvent(code);
    const observer_click = onNodeEvent(view, Event.CLICK);

    return merge(observer_keyboard, observer_click);
}
