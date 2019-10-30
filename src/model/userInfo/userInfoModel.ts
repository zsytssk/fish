import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

/** 账户信息修改 */
export const UserInfoEvent = {
    AccountChange: 'account_change',
    NicknameChange: 'nick_name_change',
};

/** 当前用户信息.. */
export class UserInfoModel extends ComponentManager {
    /** 用户名 */
    public nickname: string;
    /** 账户信息 */
    public account_map: Map<string, number> = new Map();
    constructor() {
        super();
    }
    public get event() {
        let event = this.getCom(EventCom);
        if (!event) {
            event = new EventCom();
            this.addCom(event);
        }
        return event;
    }
    public setNickname(name: string) {
        this.nickname = name;
        this.event.emit(UserInfoEvent.NicknameChange, this.nickname);
    }
    /** 选择当前用户的coin */
    public setAccount(data: { [key: string]: number }) {
        for (const key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }
            this.account_map.set(key, data[key]);
        }
        this.event.emit(UserInfoEvent.AccountChange, this.account_map);
    }
}
