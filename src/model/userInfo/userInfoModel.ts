import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { Lang } from 'data/internationalConfig';
import coingame from 'coingame/coingame.min';

/** 账户信息修改 */
export const UserInfoEvent = {
    CurBalanceChange: 'cur_balance_change',
    LangChange: 'lang_change',
    AccountChange: 'account_change',
    NicknameChange: 'nick_name_change',
};
export type AccountMap = Map<string, { num: number; icon: string }>;
/** 当前用户信息.. */
export class UserInfoModel extends ComponentManager {
    /** 语言 */
    public lang: Lang;
    /** 当前钱币类型 */
    public cur_balance: string;
    /** 用户id */
    public user_id: string;
    /** 用户名 */
    public nickname: string;
    /** 账户信息 */
    public account_map: AccountMap = new Map();
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
    /** 选择当前用户当前的coin类型 */
    public setCurBalance(balance: string) {
        if (balance === this.cur_balance) {
            return;
        }
        this.cur_balance = balance;
        setTimeout(() => {
            this.event.emit(UserInfoEvent.CurBalanceChange, balance);
        });
    }
    public setLang(lang: Lang) {
        if (lang === this.lang) {
            return;
        }
        this.lang = lang;
        coingame.sys.updateLanguage(lang);
        this.event.emit(UserInfoEvent.LangChange, lang);
    }
    public setUserId(name: string) {
        this.user_id = name;
    }
    public setNickname(name: string) {
        this.nickname = name;
        this.event.emit(UserInfoEvent.NicknameChange, this.nickname);
    }
    /** 选择当前用户的coin */
    public setAccount(data: UserAccountRep['balances']) {
        for (const key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }
            if (!this.cur_balance) {
                this.setCurBalance(key);
            }
            const { balance: num, imageUrl: icon } = data[key];
            this.account_map.set(key, {
                num,
                icon,
            });
        }
        this.event.emit(UserInfoEvent.AccountChange, this.account_map);
    }
}
