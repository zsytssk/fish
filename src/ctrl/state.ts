import { AppCtrl } from './app';
import { AppModel } from 'model/appModel';
import { GameCtrl } from './game/gameCtrl';
import { GameModel } from 'model/gameModel';

type State = {
    app_ctrl: AppCtrl;
    app_model: AppModel;
    game_ctrl: GameCtrl;
    game_model: GameModel;
};

export const state = {} as State;
