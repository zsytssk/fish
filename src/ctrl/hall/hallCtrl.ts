import honor from 'honor';
import {
    fakeLoad,
    mergeProgressObserver,
    toProgressObserver,
} from 'honor/utils/loadRes';
import { runAsyncTask } from 'honor/utils/tmpAsyncTask';

import { ctrlState } from '@app/ctrl/ctrlState';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { gotoGuide } from '@app/ctrl/guide/guideConfig';
import { AudioRes } from '@app/data/audioRes';
import { Lang } from '@app/data/internationalConfig';
import { ArenaEvent } from '@app/data/serverEvent';
import { modelState } from '@app/model/modelState';
import { AccountMap } from '@app/model/userInfo/userInfoModel';
import { getItem } from '@app/utils/localStorage';
import HallView from '@app/view/scenes/hallView';
import Loading from '@app/view/scenes/loadingView';

import { AppCtrl } from '../appCtrl';
import {
    bindArenaHallSocket,
    offArenaHallSocket,
    sendToArenaHallSocket,
} from './arenaSocket';
import {
    getAllLangList,
    offBindEvent,
    onAccountChange,
    onArenaInfoChange,
    onCurBalanceChange,
    onLangChange,
    onNicknameChange,
} from './hallCtrlUtil';
import { bindHallSocket, offHallSocket, roomIn } from './hallSocket';
import { hallViewEvent, setRoomInData } from './hallViewEvent';

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
        } catch {}

        try {
            await bindArenaHallSocket(this);
            sendToArenaHallSocket(ArenaEvent.ArenaStatus, {
                currency: modelState.app.user_info.cur_balance,
            });
        } catch {}

        AudioCtrl.playBg(AudioRes.HallBg);

        this.initModelEvent();
        if (getItem('guide') !== 'end') {
            return gotoGuide('1', '1');
        }

        hallViewEvent(this);
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
            console.log(`test:>onArenaInfoChange`, view.destroyed);
            view.updateArenaInfo(info);
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

    public destroy() {
        AudioCtrl.stop(AudioRes.HallBg);
        offBindEvent(this);
        offHallSocket(this);
        offArenaHallSocket(this);
        honor.director.closeAllDialogs();
        HallCtrl.leave();
    }
}
