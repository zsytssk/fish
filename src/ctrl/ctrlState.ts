import { AppCtrl } from './appCtrl';
import { GameCtrl } from './game/gameCtrl';
import { GameCtrl as GrandPrixCtrl } from './grandPrix/gameCtrl';
import { HallCtrl } from './hall/hallCtrl';

type CtrlState = {
    app: AppCtrl;
    game: GameCtrl | GrandPrixCtrl;
    hall: HallCtrl;
};
export const ctrlState = {} as CtrlState;
