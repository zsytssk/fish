import honor from 'honor';
import { loadRes, ProgressFn } from 'honor/utils/loadRes';

import GameConfig from '@app/GameConfig';
import { Config } from '@app/data/config';
import { isProd } from '@app/data/env';
import { font_list, res } from '@app/data/res';
import { ArenaErrCode, ServerErrCode } from '@app/data/serverEvent';
import { AppModel } from '@app/model/appModel';
import { modelState } from '@app/model/modelState';
import { BgMonitor } from '@app/utils/bgMonitor';
import { KeyBoardNumber } from '@app/utils/layaKeyboard';
import { removeItem } from '@app/utils/localStorage';
import { tplIntr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';
import Loading, { LoadingEvent } from '@app/view/scenes/loadingView';

import { ctrlState } from './ctrlState';
import { AudioCtrl } from './ctrlUtils/audioCtrl';
import { GameCtrl as ArenaCtrl } from './game/gameArena/gameCtrl';
import { GameCtrl } from './game/gameCtrl';
import { connectArenaHallSocket } from './hall/arenaSocket';
import { tokenExpireTip } from './hall/commonSocket';
import { HallCtrl } from './hall/hallCtrl';
import { connectHallSocket, getArenaWs } from './hall/hallSocket';

/** 顶级 ctrl */
export class AppCtrl {
    public model: AppModel;
    public bg_monitor = new BgMonitor();
    public keyboard_number: KeyBoardNumber;
    constructor() {
        this.startApp();
    }
    public async startApp() {
        ctrlState.app = this;
        const model = new AppModel();
        this.model = model;
        model.init();

        await honor.run(GameConfig, {
            defaultVersion: Config.CdnVersion,
            versionPath: `./version.json?v=${Config.CdnVersion}`,
            basePath: Config.cndUrl,
            zip_path: './zip/zip_map.json',
            zip_folder: './zip',
        });

        Loading.event_com.once(LoadingEvent.Show, () => {
            platform.hideLoading();
        });

        this.keyboard_number = new KeyBoardNumber();
        AudioCtrl.init();

        try {
            const [isReplay, replayData] = await connectHallSocket();
            await getArenaWs(1).then((data) => {
                Config.arenaSocketUrl = data;
            });
            if (isReplay) {
                this.enterGame(replayData);
                return;
            }
        } catch (err) {
            if (isProd()) {
                return this.initSocketErr(err);
            }
        }

        try {
            const isArenaReplay = await connectArenaHallSocket(true);
            if (isArenaReplay) {
                this.enterArenaGame({
                    currency: modelState.app.user_info.cur_balance,
                });
                return;
            }
        } catch (err) {
            if (isProd()) {
                if (err === ArenaErrCode.TokenExpire) {
                    removeItem('local_arena_token');
                }
                // return this.initSocketErr(err);
            }
        }

        await HallCtrl.preEnter();
    }
    public initSocketErr(err: any) {
        Loading.load().then(() => {
            Loading.instance.onShow();
            Loading.instance.onProgress(1);
        });
        if (err === ServerErrCode.TokenExpire) {
            return tokenExpireTip();
        }
        AlertPop.alert(tplIntr(ServerErrCode.NetError)).then(() => {
            location.reload();
        });
    }
    /** 公共loading */
    public static async commonLoad(progress: ProgressFn) {
        await loadRes([...res.common, ...res.font], progress);
        honor.utils.registerFontSize(font_list);
    }
    public enterGame(data: Partial<RoomInRep>) {
        return GameCtrl.preEnter(data);
    }
    public enterArenaGame(data: Partial<RoomInRep>) {
        return ArenaCtrl.preEnter(data);
    }
}
