import { Component } from 'comMan/component';

import { PlayerEvent, PlayerModel } from '@app/model/game/playerModel';

import { GameCtrl } from './gameCtrl';

export class ArenaPlayerCom implements Component {
    constructor(public model: PlayerModel, public game_ctrl: GameCtrl) {
        this.init();
    }
    private init() {
        const { model, game_ctrl } = this;
        const event = model.event;
        const view = game_ctrl.view;

        event.on(
            PlayerEvent.UpdateInfo,
            () => {
                const { bullet_num, is_cur_player } = this.model;
                view.setBulletScoreNum(is_cur_player, bullet_num, 0);
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
