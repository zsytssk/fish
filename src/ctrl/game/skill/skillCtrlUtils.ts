import { merge } from 'rxjs';

import { Sprite } from 'laya/display/Sprite';
import { Event } from 'laya/events/Event';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { getLang } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { Config } from '@app/data/config';
import { InternationalTip } from '@app/data/internationalConfig';
import { ServerEvent } from '@app/data/serverEvent';
import { getBeBombFishIds } from '@app/model/game/fish/fishModelUtils';
import { PlayerModel } from '@app/model/game/playerModel';
import { BombModel } from '@app/model/game/skill/bombModel';
import { FreezeModel } from '@app/model/game/skill/freezeModel';
import {
    LockActiveData,
    LockFishModel,
} from '@app/model/game/skill/lockFishModel';
import { SkillStatus } from '@app/model/game/skill/skillCoreCom';
import { SkillModel } from '@app/model/game/skill/skillModel';
import { getAimFish, modelState } from '@app/model/modelState';
import { offMouseMove, onMouseMove, onNode } from '@app/utils/layaUtils';
import { debug } from '@app/utils/log';
import { onKeyBoardEvent, onNodeEvent } from '@app/utils/rxUtils';
import AlertPop from '@app/view/pop/alert';
import ShopPop from '@app/view/pop/shop';
import TopTipPop from '@app/view/pop/topTip';
import {
    activeAim,
    activeAimFish,
    stopAim,
} from '@app/view/scenes/game/ani_wrap/aim';
import { activeExploding } from '@app/view/scenes/game/ani_wrap/exploding';
import {
    offFishClick,
    onFishClick,
    onPoolClick,
    offPoolClick,
    viewState,
} from '@app/view/viewState';

import { GameCtrlUtils } from '../gameCtrl';

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
        const { pool } = viewState.game;

        TopTipPop.hide();
        stopAim('aim_big');
        offPoolClick();
        offMouseMove(pool);
    }
}
/** 技能的激活前的处理 */
export function skillPreActiveHandler(
    model: SkillModel,
    game_ctrl: GameCtrlUtils,
) {
    const lang = getLang();
    const { buySkillTip, posBombTip, aimFish } = InternationalTip[lang];
    if (model.skill_core.num <= 0) {
        AlertPop.alert(buySkillTip).then((type) => {
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
        game_ctrl.sendToGameSocket(ServerEvent.UseFreeze);
    } else if (model instanceof BombModel) {
        TopTipPop.tip(posBombTip, 2);
        const { pool } = viewState.game;
        const { PoolWidth, PoolHeight } = Config;
        activeAim({ x: PoolWidth / 2, y: PoolHeight / 2 });
        onMouseMove(pool, (pos) => activeAim(pos));

        // 炸弹
        onPoolClick(true).subscribe((pos: Point) => {
            offMouseMove(pool);
            stopAim('aim_big');
            const fish_list = getBeBombFishIds(pos);
            game_ctrl.sendToGameSocket(ServerEvent.UseBomb, {
                bombPoint: pos,
                fishList: fish_list,
            } as UseBombReq);
        });
    } else if (model instanceof LockFishModel) {
        const {
            user_id,
            is_cur_player: is_cur,
            need_emit,
        } = model.skill_core.player;
        const fish = getAimFish();
        if (!is_cur && need_emit) {
            // sendToGameSocket(ServerEvent.LockFish, {
            //     robotId: user_id,
            //     eid: fish.id,
            // } as LockFishReq);
            return;
        }

        const player = modelState.app.game.getCurPlayer();

        TopTipPop.tip(aimFish, 2);
        activeAimFish(fish, false, player.gun.pos);
        // 选中鱼
        onFishClick(true).subscribe((fish_id: string) => {
            game_ctrl.sendToGameSocket(ServerEvent.LockFish, {
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
    player_model: PlayerModel,
    game_ctrl: GameCtrlUtils,
) {
    return new Promise((resolve, _reject) => {
        const lang = getLang();
        const { aimFish } = InternationalTip[lang];
        if (model instanceof LockFishModel) {
            const { fish, is_tip, gun_pos } = info as LockActiveData;
            if (!player_model.is_cur_player) {
                debug(`lock:>skill:>skillActiveHandler`, is_tip);
                if (player_model.need_emit && is_tip && fish) {
                    game_ctrl.sendToGameSocket(ServerEvent.LockFish, {
                        robotId: player_model.user_id,
                        eid: fish.id,
                    } as LockFishReq);
                }
                return;
            }

            if (is_tip) {
                // 激活锁定之后 提示选中鱼 选中之后发给服务器...
                TopTipPop.tip(aimFish, 2);
            }
            const fire = !is_tip;
            activeAimFish(fish, fire, gun_pos);

            // 选中鱼
            onFishClick().subscribe((fish_id: string) => {
                game_ctrl.sendToGameSocket(ServerEvent.LockFish, {
                    eid: fish_id,
                } as LockFishRep);
            });
            // ...
        } else if (model instanceof BombModel) {
            const { pool } = viewState.game;
            activeExploding(info as Point);
            offMouseMove(pool);
            AudioCtrl.play(AudioRes.Bomb);
            resolve(undefined);
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
            resolve(undefined);
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
