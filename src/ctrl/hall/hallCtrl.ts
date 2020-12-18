import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { disconnectSocket, getSocket } from 'ctrl/net/webSocketWrapUtil';
import { AudioRes } from 'data/audioRes';
import { Lang } from 'data/internationalConfig';
import { ServerName } from 'data/serverEvent';
import { modelState } from 'model/modelState';
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
import { onHallSocket, roomIn, offHallSocket } from './hallSocket';
import { hallViewEvent, setRoomInData } from './hallViewEvent';
import { ctrlState } from 'ctrl/ctrlState';
import { runAsyncTask } from 'honor/utils/tmpAsyncTask';
import { getItem } from 'utils/localStorage';
import honor from 'honor';
import GameRecord from 'view/pop/record/gameRecord';
import ItemRecord from 'view/pop/record/itemRecord';
import { gotoGuide } from 'ctrl/guide/guideConfig';
import { sleep } from 'utils/animate';

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
    private async init() {
        await onHallSocket(this).then(async enter_game => {
            if (enter_game) {
                return this.destroy();
            } else {
                AudioCtrl.playBg(AudioRes.HallBg);
            }

            this.initModelEvent();
            if (getItem('guide') !== 'end') {
                return gotoGuide('1', '1');
            }

            hallViewEvent(this);
        });
    }
    private initModelEvent() {
        const { view } = this;
        const { user_info } = modelState.app;
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
        this.view.onResize();
    }
    public destroy() {
        AudioCtrl.stop(AudioRes.HallBg);
        offBindEvent(this);
        offLangChange(this);
        offHallSocket(this);
        disconnectSocket(ServerName.Hall);
        honor.director.closeAllDialogs();
        HallCtrl.leave();
    }
}
