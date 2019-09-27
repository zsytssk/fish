import { AppCtrl } from './app';
import { AppModel } from 'model/appModel';
import { GameCtrl } from './game/gameCtrl';
import { GameModel } from 'model/gameModel';
import { stat } from 'fs';
import { createSprite } from 'utils/dataUtil';

type State = {
    app_ctrl: AppCtrl;
    app_model: AppModel;
    game_ctrl: GameCtrl;
    game_model: GameModel;
};

export const state = {} as State;

export function addBullet(skin: string) {
    const { pool } = state.game_ctrl.view;

    const bullet = createSprite('bullet', skin);
    pool.addChild(bullet);

    return bullet;
}
export function addNet(skin: string) {
    const { pool } = state.game_ctrl.view;
    const net = createSprite('net', skin);
    pool.addChild(net);
    return net;
}
