import { GameModel } from './gameModel';
import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

export const AppEvent = {
    PathChange: 'path_change',
};
/** 全局数据 */
export class AppModel extends ComponentManager {
    constructor() {
        super();
        this.addCom(new EventCom());
    }
    public enterGame() {
        return new GameModel();
    }
}
