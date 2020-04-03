import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { disconnectSocket } from 'ctrl/net/webSocketWrapUtil';
import { AudioRes } from 'data/audioRes';
import { Lang } from 'data/internationalConfig';
import { ServerName } from 'data/serverEvent';
import { getUserInfo, modelState } from 'model/modelState';
import { AccountMap } from 'model/userInfo/userInfoModel';
import HallView from 'view/scenes/hallView';
import {
    getAllLangList,
    offBindEvent,
    onAccountChange,
    onCurBalanceChange,
    onLangChange,
    onNicknameChange,
} from './hallCtrlUtil';
import { onHallSocket, roomIn } from './hallSocket';
import { hallViewEvent } from './hallViewEvent';
import { initUserInfo } from 'model/userInfo/userInfoUtils';
import { ctrlState } from 'ctrl/ctrlState';

export class HallCtrl {
    public view: HallView;
    constructor(view: HallView) {
        this.view = view;
        this.init();
    }
    private static instance: HallCtrl;
    private static wait_enter: Promise<HallCtrl>;
    public static async preEnter() {
        if (this.instance) {
            return this.instance;
        }
        if (this.wait_enter) {
            return await this.wait_enter;
        }
        const wait_view = HallView.preEnter() as Promise<HallView>;
        const wait_enter = Promise.all([wait_view]).then(([view]) => {
            const ctrl = new HallCtrl(view);
            this.instance = ctrl;
            this.wait_enter = undefined;
            return ctrl;
        });

        this.wait_enter = wait_enter;
        return await wait_enter;
    }

    public static leave() {
        this.instance = undefined;
    }

    public enterGame(socketUrl: string) {
        this.destroy();
        return ctrlState.app.enterGame(socketUrl);
    }
    public roomIn(...data: Parameters<typeof roomIn>) {
        return roomIn(data[0]).then((url: string) => {
            return this.enterGame(url);
        });
    }
    private async init() {
        hallViewEvent(this);
        this.initModelEvent();
        await onHallSocket(this).then(enter_game => {
            initUserInfo();
            if (enter_game) {
                this.destroy();
            } else {
                AudioCtrl.play(AudioRes.HallBg, true);
            }
        });
    }
    private initModelEvent() {
        const { view } = this;
        const { user_info } = modelState.app;
        onCurBalanceChange(this, (type: string) => {
            const { account_map } = user_info;
            const { num, icon } = account_map.get(type);
            view.setCurBalance(type, icon, num);
        });
        onLangChange(this, (lang: Lang) => {
            view.setFlag(lang);
        });
        onAccountChange(this, (data: AccountMap) => {
            view.setCoinData(data);
        });
        onNicknameChange(this, (nickname: string) => {
            view.setNickname(nickname);
        });
        view.setFlagData(getAllLangList());
        user_info.setLang('zh' as Lang);
    }
    public selectCoin = (index: number) => {
        if (index === -1) {
            return;
        }
        const { view } = this;
        const {
            coin_menu: { list },
        } = view.header;
        const { user_info } = modelState.app;
        const coin_type = list.array[index].coin_name;
        user_info.setCurBalance(coin_type);
        view.toggleCoinMenu();
    }; // tslint:disable-line
    public selectFlag = (index: number) => {
        if (index === -1) {
            return;
        }
        const { view } = this;
        const {
            flag_menu: { list },
        } = view.header;
        const { user_info } = modelState.app;
        const flag_type = list.array[index].flag_type;

        user_info.setLang(flag_type);
        view.toggleFlagMenu();
    }; // tslint:disable-line

    public onUserAccount(data: UserAccountRep) {
        const { btn_leave, btn_login } = this.view.header;
        const { userId, showName, balances } = data;
        const user_info = getUserInfo();
        user_info.setUserId(userId);
        user_info.setNickname(showName);
        user_info.setAccount(balances);

        /** 登陆之后显示离开按钮 */
        btn_leave.visible = true;
        btn_login.visible = false;
    }
    public destroy() {
        AudioCtrl.stop(AudioRes.HallBg);
        offBindEvent(this);
        disconnectSocket(ServerName.Hall);
        HallCtrl.leave();
    }
}
