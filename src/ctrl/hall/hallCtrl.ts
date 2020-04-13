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
    offLangChange,
} from './hallCtrlUtil';
import { onHallSocket, roomIn } from './hallSocket';
import { hallViewEvent } from './hallViewEvent';
import { ctrlState } from 'ctrl/ctrlState';
import { runAsyncTask } from 'honor/utils/tmpAsyncTask';

export class HallCtrl {
    public view: HallView;
    constructor(view: HallView) {
        this.view = view;
        this.init();
    }
    private static instance: HallCtrl;
    public static preEnter() {
        if (this.instance) {
            return this.instance;
        }
        return runAsyncTask(() => {
            return HallView.preEnter().then((view: HallView) => {
                const ctrl = new HallCtrl(view);
                this.instance = ctrl;
                return ctrl;
            });
        }, this);
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
            if (enter_game) {
                this.destroy();
            } else {
                AudioCtrl.playBg(AudioRes.HallBg);
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
        view.toggleCoinMenu(false);
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
        view.toggleFlagMenu(false);
    }; // tslint:disable-line

    public onUserAccount() {
        const { btn_leave, btn_login } = this.view.header;
        /** 登陆之后显示离开按钮 */
        btn_leave.visible = true;
        btn_login.visible = false;
    }
    public destroy() {
        AudioCtrl.stop(AudioRes.HallBg);
        offBindEvent(this);
        offLangChange(this);
        disconnectSocket(ServerName.Hall);
        HallCtrl.leave();
    }
}
