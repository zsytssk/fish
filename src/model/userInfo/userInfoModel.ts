import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

import { Config } from '@app/data/config';
import { Lang } from '@app/data/internationalConfig';
import { setItem } from '@app/utils/localStorage';

import { getCacheCurrency, setCacheBalance } from './userInfoUtils';

/** 账户信息修改 */
export const UserInfoEvent = {
    CurBalanceChange: 'cur_balance_change',
    LangChange: 'lang_change',
    AccountChange: 'account_change',
    NicknameChange: 'nick_name_change',
};
export type AccountMap = Map<
    string,
    { num: number; icon: string; hide: 0 | 1 }
>;
/** 当前用户信息.. */
export class UserInfoModel extends ComponentManager {
    /** 语言 */
    public lang = 'en' as Lang;
    /** 当前钱币类型 */
    public cur_balance = 'BTC';
    /** 用户id */
    public user_id: string;
    /** 用户名 */
    public nickname: string;
    /** 账户信息 */
    public account_map: AccountMap = new Map();
    constructor() {
        super();
    }
    public init() {
        const lang = Config.lang;
        this.setLang(lang);
    }
    public initUserInfo(data: UserAccountRep) {
        const { userId, showName, balances } = data;
        this.setUserId(userId);
        this.setNickname(showName);
        this.setAccount(balances);
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
    public setCurBalance(balance: string, force_change = false) {
        setCacheBalance(balance, this.account_map.get(balance)?.num);
        if (balance === this.cur_balance && !force_change) {
            return;
        }
        this.cur_balance = balance;
        this.event.emit(UserInfoEvent.CurBalanceChange, balance);
    }
    public setLang(lang: Lang) {
        if (lang === this.lang) {
            return;
        }
        this.lang = lang;
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
        let first_balance: string;
        for (const key in data) {
            if (!first_balance) {
                first_balance = key;
            }
            const { balance: num, imageUrl: icon, hide } = data[key];
            this.account_map.set(key, {
                num: Number(num),
                icon,
                hide,
            });
        }
        this.event.emit(UserInfoEvent.AccountChange, this.account_map);
        const cur_balance = getCacheCurrency(this.account_map);

        /** 强制更新当前货币, 防止 货币数目发生变化 */
        this.setCurBalance(cur_balance || first_balance, true);
    }
}
