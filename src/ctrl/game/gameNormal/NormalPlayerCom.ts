import { Component } from 'comMan/component';

import { getGameCurrency } from '@app/ctrl/ctrlState';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { errorHandler } from '@app/ctrl/hall/commonSocket';
import { AudioRes } from '@app/data/audioRes';
import { ServerErrCode } from '@app/data/serverEvent';
import { GunEvent } from '@app/model/game/gun/gunModel';
import {
    CaptureInfo,
    PlayerEvent,
    PlayerModel,
} from '@app/model/game/playerModel';
import { showAwardCircle } from '@app/view/scenes/game/ani_wrap/award/awardBig';
import { showAwardCoin } from '@app/view/scenes/game/ani_wrap/award/awardCoin';
import { awardSkill } from '@app/view/scenes/game/ani_wrap/award/awardSkill';

import { GameCtrl } from '../gameCtrl';

export class NormalPlayerCom implements Component {
    constructor(public model: PlayerModel, public game_ctrl: GameCtrl) {
        this.init();
    }
    private init() {
        const { model, game_ctrl } = this;
        const event = model.event;
        const gun_event = model.gun.event;
        const view = game_ctrl.view;

        event.on(
            PlayerEvent.CaptureFish,
            (capture_info: CaptureInfo) => {
                const {
                    pos,
                    data: { win, drop },
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

                if (!win) {
                    resolve();
                } else if (model.is_cur_player && win > 1000) {
                    /** 奖励圆环 */
                    showAwardCircle(pos, win, model.is_cur_player).then(
                        resolve,
                    );
                } else {
                    /** 奖励金币动画 */
                    showAwardCoin(pos, end_pos, win, model.is_cur_player).then(
                        resolve,
                    );
                }
            },
            this,
        );

        if (!model.is_cur_player) {
            return;
        }

        view.setBulletNum(model.bullet_num);
        event.on(PlayerEvent.UpdateInfo, () => {
            const { bullet_num } = this.model;
            view.setBulletNum(bullet_num);
        });

        gun_event.on(
            GunEvent.NotEnoughBulletNum,
            () => {
                const socket = this.game_ctrl.getSocket();
                if (this.game_ctrl.isTrial) {
                    errorHandler(ServerErrCode.TrialNotBullet);
                } else {
                    errorHandler(ServerErrCode.ReExchange);
                }
            },
            this,
        );
    }
    public destroy() {
        const {
            model: { event: player_event },
        } = this;
        player_event.offAllCaller(this);
    }
}
