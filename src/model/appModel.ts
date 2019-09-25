import { GameModel } from './gameModel';
import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

export const AppPath = {
    Game: 'game',
    Hall: 'hall',
};
export const AppEvent = {
    PathChange: 'path_change',
};
/** 全局数据 */
export class AppModel extends ComponentManager {
    private path: string;
    constructor() {
        super();
        this.addCom(new EventCom());
    }
    public enterGame() {
        return new GameModel();
    }
    public changePath(path: string) {
        if (path === this.path) {
            return;
        }
        this.path = path;
        this.getCom(EventCom).emit(AppEvent.PathChange);
    }
}
