import coingame from 'coingame/coingame.min';
import {
    coingameLogin,
    coingameUpdateLanguage,
    coingameWithDraw,
    coingameCharge,
    coingameHome,
    coingameApp,
} from 'coingame/coingameUtil';
import { disconnectSocket } from 'ctrl/net/webSocketWrapUtil';
import { Lang } from 'data/internationalConfig';
import { ServerName } from 'data/serverEvent';
import { getUserInfo, modelState } from 'model/modelState';
import { AccountMap } from 'model/userInfo/userInfoModel';
import ShopPop from 'view/pop/shop';
import HallView from 'view/scenes/hallView';
import {
    getAllLangList,
    offBindEvent,
    onAccountChange,
    onCurBalanceChange,
    onLangChange,
    onNicknameChange,
} from './hallCtrlUtil';
import { checkReplay, onHallSocket, roomIn } from './hallSocket';
import { loginOut } from './login';
import VoicePop from 'view/pop/voice';

export class HallCtrl {
    private view: HallView;
    constructor(view: HallView) {
        this.view = view;
        this.init();
    }
    public static async preEnter() {
        const wait_view = HallView.preEnter() as Promise<HallView>;
        return Promise.all([wait_view]).then(([view]) => {
            const ctrl = new HallCtrl(view);
        });
    }
    private async init() {
        this.initViewEvent();
        this.initModelEvent();
        await onHallSocket(this);
        if (await checkReplay(this)) {
            this.destroy();
        }
    }
    private initModelEvent() {
        const { view } = this;
        const { user_info } = modelState.app;
        onCurBalanceChange(this, (type: string) => {
            const { account_map } = user_info;
            const { num, icon } = account_map.get(type);
            view.setCoin(type, icon, num);
        });
        onLangChange(this, (lang: Lang) => {
            coingameUpdateLanguage(lang);
            view.setFlag(lang);
        });
        onAccountChange(this, (data: AccountMap) => {
            view.setCoinData(data);
        });
        onNicknameChange(this, (nickname: string) => {
            view.setNickname(nickname);
        });
        view.setFlagData(getAllLangList());
        user_info.setLang(coingame.sys.config.lang as Lang);
    }
    private initViewEvent() {
        const { view } = this;
        const { normal_box, match_box, header, btn_play_now } = view;
        const {
            user_box,
            coin_menu: { list: coin_menu_list },
            flag_menu: { list: flag_menu_list },
        } = header;

        const {
            btn_coin_select,
            btn_get,
            btn_charge,
            btn_buy,
            btn_home,
            btn_app,
            btn_leave,
            btn_voice,
            flag_box,
            btn_login,
        } = header;

        coin_menu_list.selectHandler = new Laya.Handler(
            coin_menu_list,
            this.selectCoin,
            undefined,
            false,
        );
        flag_menu_list.selectHandler = new Laya.Handler(
            coin_menu_list,
            this.selectFlag,
            undefined,
            false,
        );

        const { CLICK } = Laya.Event;
        const btn_normal_try = normal_box.getChildByName('btn_try');
        const btn_normal_play = normal_box.getChildByName('btn_play');
        const btn_match_try = match_box.getChildByName('btn_try');
        const btn_match_play = match_box.getChildByName('btn_play');
        btn_login.on(CLICK, this, () => {
            coingameLogin();
        });
        btn_normal_try.on(CLICK, this, () => {
            roomIn({ roomId: 1, isTrial: 1 });
        });
        btn_normal_play.on(CLICK, this, () => {
            roomIn({ roomId: 1, isTrial: 0 });
        });
        btn_match_play.on(CLICK, this, () => {
            roomIn({ roomId: 2, isTrial: 0 });
        });
        btn_match_try.on(CLICK, this, () => {
            roomIn({ roomId: 2, isTrial: 1 });
        });
        btn_play_now.on(CLICK, this, () => {
            roomIn({ roomId: 1, isTrial: 1 }).then(() => {
                this.destroy();
            });
        });
        btn_coin_select.on(CLICK, this, () => {
            view.toggleBalanceMenu();
        });
        btn_get.on(CLICK, this, () => {
            coingameCharge('');
        });
        btn_charge.on(CLICK, this, () => {
            coingameWithDraw('');
        });
        btn_buy.on(CLICK, this, () => {
            ShopPop.preEnter();
        });
        btn_home.on(CLICK, this, () => {
            coingameHome();
        });
        btn_app.on(CLICK, this, () => {
            coingameApp();
        });
        btn_leave.on(CLICK, this, () => {
            loginOut();
        });
        btn_voice.on(CLICK, this, () => {
            VoicePop.preEnter();
        });
        flag_box.on(CLICK, this, () => {
            view.toggleFlagMenu();
        });
    }
    private selectCoin = (index: number) => {
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
        view.toggleBalanceMenu();
    }; // tslint:disable-line
    private selectFlag = (index: number) => {
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
        offBindEvent(this);
        disconnectSocket(ServerName.Hall);
    }
}
