import { Component } from 'comMan/component';

import { PlayerEvent, PlayerModel } from '@app/model/game/playerModel';

import { GameCtrl } from '../gameCtrl';

export class NormalPlayerCom implements Component {
    constructor(public model: PlayerModel, public game_ctrl: GameCtrl) {
        this.init();
    }
    private init() {
        const { model, game_ctrl } = this;
        const event = model.event;
        const view = game_ctrl.view;

        event.on(PlayerEvent.UpdateInfo, () => {
            const { bullet_num } = this.model;
            view.setBulletNum(bullet_num);
        });

        if (model.is_cur_player) {
            view.setBulletNum(model.bullet_num);
        }
    }
    public destroy() {
        const {
            model: { event: player_event },
        } = this;
        player_event.offAllCaller(this);
    }
}
