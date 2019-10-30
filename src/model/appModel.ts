import { GameModel } from './game/gameModel';
import { modelState } from './modelState';
import { SettingModel } from './userInfo/settingModel';
import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { UserInfoModel } from './userInfo/userInfoModel';

/** 全局数据 */
export class AppModel extends ComponentManager {
    public game: GameModel;
    /** 设置信息 */
    public setting = new SettingModel();
    /** 用户信息 */
    public user_info = new UserInfoModel();
    constructor() {
        super();
        modelState.app = this;
        this.addCom(new EventCom());
    }
    public enterGame() {
        const game = new GameModel();
        this.game = game;
        return game;
    }
    public leaveGame() {
        this.game = undefined;
    }
}
