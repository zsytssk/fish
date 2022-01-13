import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

import { ArenaModel } from './arena/arenaModel';
import { modelState } from './modelState';
import { SettingModel } from './userInfo/settingModel';
import { UserInfoModel } from './userInfo/userInfoModel';

/** 全局数据 */
export class AppModel extends ComponentManager {
    /** 设置信息 */
    public setting: SettingModel;
    /** 用户信息 */
    public user_info: UserInfoModel;
    /** 竞技场信息 */
    public arena_info: ArenaModel;
    constructor() {
        super();
        modelState.app = this;

        this.setting = new SettingModel();
        this.user_info = new UserInfoModel();
        this.arena_info = new ArenaModel();
        this.addCom(new EventCom());
    }
    public init() {
        this.user_info.init();
    }
    public initUserInfo(data: UserAccountRep) {
        this.user_info.initUserInfo(data);
        this.setting.initUserInfo(data);
    }
}
