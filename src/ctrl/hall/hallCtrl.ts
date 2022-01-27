import honor from 'honor';
import {
    fakeLoad,
    mergeProgressObserver,
    toProgressObserver,
} from 'honor/utils/loadRes';
import { runAsyncTask } from 'honor/utils/tmpAsyncTask';

import { ctrlState, getGameCurrency } from '@app/ctrl/ctrlState';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { gotoGuide } from '@app/ctrl/guide/guideConfig';
import { AudioRes } from '@app/data/audioRes';
import { Lang } from '@app/data/internationalConfig';
import { ArenaErrCode, ArenaEvent, ServerErrCode } from '@app/data/serverEvent';
import { modelState } from '@app/model/modelState';
import { AccountMap } from '@app/model/userInfo/userInfoModel';
import { getCacheCurrency } from '@app/model/userInfo/userInfoUtils';
import { asyncOnly } from '@app/utils/asyncQue';
import { BgMonitorEvent } from '@app/utils/bgMonitor';
import { getItem } from '@app/utils/localStorage';
import AlertPop from '@app/view/pop/alert';
import TipPop from '@app/view/pop/tip';
import HallView from '@app/view/scenes/hallView';
import Loading from '@app/view/scenes/loadingView';

import { AppCtrl } from '../appCtrl';
import { getSocket } from '../net/webSocketWrapUtil';
import {
    bindArenaHallSocket,
    offArenaHallSocket,
    sendToArenaHallSocket,
} from './arenaSocket';
import { tipComeBack } from './commonSocket';
import {
    offBindEvent,
    onAccountChange,
    onArenaInfoChange,
    onCurBalanceChange,
    onLangChange,
    onNicknameChange,
    recharge,
} from './hallCtrlUtil';
import { bindHallSocket, offHallSocket, roomIn } from './hallSocket';
import { hallViewEvent, setRoomInData } from './hallViewEvent';
import { login } from './login';

export class HallCtrl {
    public view: HallView;
    constructor(view: HallView) {
        this.view = view;
        this.init();
    }
    public static instance: HallCtrl;
    public static async preEnter() {
        if (this.instance) {
            return this.instance;
        }

        const arr = [
            toProgressObserver(HallView.preEnter)(),
            toProgressObserver(fakeLoad)(0.5),
            toProgressObserver(AppCtrl.commonLoad)(),
            toProgressObserver(AppCtrl.commonLoad)(),
        ] as const;

        return runAsyncTask(async () => {
            const [view] = await mergeProgressObserver(
                arr as Mutable<typeof arr>,
                Loading,
            );

            const ctrl = new HallCtrl(view as HallView);
            this.instance = ctrl;
            return ctrl;
        }, this);
    }

    public static leave() {
        this.instance = undefined;
    }

    public enterGame(data: Partial<RoomInRep>) {
        this.destroy();
        return ctrlState.app.enterGame(data);
    }
    public roomIn(...data: Parameters<typeof roomIn>) {
        const roomInData = data[0];
        return roomIn(roomInData, this).then((enterData: any) => {
            setRoomInData(roomInData);
            return this.enterGame(enterData);
        });
    }
    public enterArena(data) {
        this.destroy();
        return ctrlState.app.enterArenaGame(data);
    }
    private async init() {
        try {
            await bindHallSocket(this);
        } catch {
            //
        }

        try {
            await bindArenaHallSocket(this);
            sendToArenaHallSocket(ArenaEvent.ArenaStatus, {
                currency: modelState.app.user_info.cur_balance,
            });
        } catch {
            //
        }

        AudioCtrl.playBg(AudioRes.HallBg);

        this.initModelEvent();
        if (getItem('guide') !== 'end') {
            return gotoGuide('1', '1');
        }

        this.initEvent();

        hallViewEvent(this);
    }
    private initEvent() {
        const { bg_monitor } = ctrlState.app;
        bg_monitor.event.on(
            BgMonitorEvent.VisibleChange,
            (visible) => {
                const socket = getSocket('hall');
                if (visible) {
                    if (socket?.status === 'OPEN') {
                        tipComeBack();
                    } else {
                        socket?.reconnect();
                    }
                }
            },
            this,
        );

        const tip = (msg: string) => {
            asyncOnly(msg, () => {
                return TipPop.tip(msg);
            });
        };

        AppCtrl.event.on(
            ArenaErrCode.GuestSignUpFail,
            (msg) => {
                return AlertPop.alert(msg).then((type) => {
                    if (type === 'confirm') {
                        login();
                    }
                });
            },
            this,
        );

        AppCtrl.event.on(
            ServerErrCode.NoMoney,
            (msg: string) => {
                return AlertPop.alert(msg).then((type) => {
                    if (type === 'confirm') {
                        const currency = modelState.app.user_info.cur_balance;
                        recharge(currency);
                    }
                });
            },
            this,
        );
        AppCtrl.event.on(
            ArenaErrCode.NoMoney,
            (msg: string, data: any) => {
                return AlertPop.alert(msg).then((type) => {
                    if (type === 'confirm') {
                        recharge(data.currency);
                    }
                });
            },
            this,
        );
        AppCtrl.event.on(ServerErrCode.Maintaining, tip, this);
        AppCtrl.event.on(ArenaErrCode.Maintenance, tip, this);
        AppCtrl.event.on(ArenaErrCode.SignUpFail, tip, this);
        AppCtrl.event.on(ArenaErrCode.UserSignUpDeadline, tip, this);
        AppCtrl.event.on(ArenaErrCode.NoOpen, tip, this);
        AppCtrl.event.on(ArenaErrCode.GameEnded, tip, this);
    }
    private initModelEvent() {
        const { view } = this;
        const { user_info, arena_info } = modelState.app;
        onCurBalanceChange(this, (type: string) => {
            const { account_map } = user_info;
            const { num, icon, hide } = account_map.get(type);
            view.setCurBalance(type, icon, num);
            view.setRechargeBtnVisible(Boolean(!hide));
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
        onArenaInfoChange(this, (info) => {
            view.updateArenaInfo(info);
        });
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

    public destroy() {
        const { bg_monitor } = ctrlState.app;
        bg_monitor.event.offAllCaller(this);
        AudioCtrl.stop(AudioRes.HallBg);
        offBindEvent(this);
        offHallSocket(this);
        AppCtrl.event.offAllCaller(this);
        offArenaHallSocket(this);
        HallCtrl.leave();
    }
}
