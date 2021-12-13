import { AppCtrl } from './appCtrl';
import { GameCtrl as ArenaCtrl } from './arena/gameCtrl';
import { GameCtrl } from './game/gameCtrl';
import { HallCtrl } from './hall/hallCtrl';

type CtrlState = {
    app: AppCtrl;
    game: GameCtrl | ArenaCtrl;
    hall: HallCtrl;
};
export const ctrlState = {} as CtrlState;
