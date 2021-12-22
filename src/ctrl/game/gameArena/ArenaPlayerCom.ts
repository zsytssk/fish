import { Component } from 'comMan/component';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from '@app/data/audioRes';
import {
    CaptureInfo,
    PlayerEvent,
    PlayerModel,
} from '@app/model/game/playerModel';
import { getGameCurrency } from '@app/model/modelState';
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

        view.setBulletScoreNum(is_cur_player, bullet_num, score);
    }
    public destroy() {
        const {
            model: { event: player_event },
        } = this;
        player_event.offAllCaller(this);
    }
}
