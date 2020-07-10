import { AppCtrl } from './appCtrl';
import { GameCtrl } from './game/gameCtrl';
import { HallCtrl } from './hall/hallCtrl';

type CtrlState = {
    app: AppCtrl;
    game: GameCtrl;
    hall: HallCtrl;
};
export const ctrlState = {} as CtrlState;
