import { Component } from 'comMan/component';

import { getGameCurrency } from '@app/ctrl/ctrlState';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from '@app/data/audioRes';
import { GunEvent, GunStatus } from '@app/model/game/gun/gunModel';
import {
    CaptureInfo,
    PlayerEvent,
    PlayerModel,
} from '@app/model/game/playerModel';
import { asyncOnly } from '@app/utils/asyncQue';
import { tplIntr } from '@app/utils/utils';
import TipPop from '@app/view/pop/tip';
import { showAwardCircle } from '@app/view/scenes/game/ani_wrap/award/awardBig';
import { showAwardCoin } from '@app/view/scenes/game/ani_wrap/award/awardCoin';
import { awardSkill } from '@app/view/scenes/game/ani_wrap/award/awardSkill';

import { GameCtrl } from './gameCtrl';

export class ArenaPlayerCom implements Component {
    constructor(public model: PlayerModel, public game_ctrl: GameCtrl) {
        this.init();
    }
    private init() {
        const { model, game_ctrl } = this;
        const event = model.event;
        const view = game_ctrl.view;
        const { bullet_num, score, is_cur_player } = this.model;

        event.on(
            PlayerEvent.UpdateInfo,
            () => {
                const { bullet_num, score, is_cur_player } = this.model;
                view.setBulletScoreNum(is_cur_player, bullet_num, score);
            },
            this,
        );
        event.on(
            PlayerEvent.CaptureFish,
            (capture_info: CaptureInfo) => {
                const {
                    pos,
                    data: { winScore, drop },
                    resolve,
                } = capture_info;
                const { pos: end_pos } = model.gun;
                if (!pos) {
                    resolve();
                }
                if (model.is_cur_player) {
                    /** 飞行技能 */
                    if (drop) {
                        const cur_balance = getGameCurrency();
                        awardSkill(pos, end_pos, drop, cur_balance);
                    }
                    AudioCtrl.play(AudioRes.FlySkill);
                }

                if (!winScore) {
                    resolve();
                } else if (model.is_cur_player && winScore > 1000) {
                    /** 奖励圆环 */
                    showAwardCircle(pos, winScore, model.is_cur_player).then(
                        resolve,
                    );
                } else {
                    /** 奖励金币动画 */
                    showAwardCoin(
                        pos,
                        end_pos,
                        winScore,
                        model.is_cur_player,
                    ).then(resolve);
                }
            },
            this,
        );

        view.setScorePanelVisible(is_cur_player, true);
        view.setBulletScoreNum(is_cur_player, bullet_num, score);

        if (!model.is_cur_player) {
            return;
        }

        // 当前用户炮台倍数小于
        model.gun.event.on(
            GunEvent.NotEnoughBulletNum,
            () => {
                if (this.model.bullet_num) {
                    setTimeout(() => {
                        return asyncOnly(
                            'NotEnoughBulletNumChangeTurretTip',
                            () => {
                                return TipPop.tip(
                                    tplIntr(
                                        'NotEnoughBulletNumChangeTurretTip',
                                    ),
                                );
                            },
                        );
                    });
                }
            },
            this,
        );
    }
    public destroy() {
        const {
            game_ctrl,
            model: { event: player_event, is_cur_player },
        } = this;

        const view = game_ctrl.view;
        view?.setScorePanelVisible(is_cur_player, false);
        player_event.offAllCaller(this);
    }
}
