import honor from 'honor';
import { loadRes, ProgressFn } from 'honor/utils/loadRes';

import GameConfig from '@app/GameConfig';
import { Config } from '@app/data/config';
import { isProd } from '@app/data/env';
import { font_list, res } from '@app/data/res';
import { AppModel } from '@app/model/appModel';
import { modelState } from '@app/model/modelState';
import { BgMonitor } from '@app/utils/bgMonitor';
import { KeyBoardNumber } from '@app/utils/layaKeyboard';
import Loading, { LoadingEvent } from '@app/view/scenes/loadingView';

import { ctrlState } from './ctrlState';
import { AudioCtrl } from './ctrlUtils/audioCtrl';
import { GameCtrl as ArenaCtrl } from './game/gameArena/gameCtrl';
import { GameCtrl } from './game/gameCtrl';
import { connectArenaHallSocket } from './hall/arenaSocket';
import { HallCtrl } from './hall/hallCtrl';
import { connectHallSocket } from './hall/hallSocket';

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
        });

        Loading.event_com.once(LoadingEvent.Show, () => {
            platform.hideLoading();
        });

        this.keyboard_number = new KeyBoardNumber();
        AudioCtrl.init();

        try {
            const [isReplay, replayData] = await connectHallSocket();
            if (isReplay) {
                this.enterGame(replayData);
                return;
            }
        } catch {
            if (isProd()) {
                platform.hideLoading();
                return;
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
        } catch {
            if (isProd()) {
                platform.hideLoading();
                return;
            }
        }

        await HallCtrl.preEnter();
    }
    /** 公共loading */
    public static async commonLoad(progress: ProgressFn) {
        await loadRes([...res.common, ...res.font], progress);
        honor.utils.registerFontSize(font_list);
    }
    public enterGame(data: Partial<RoomInRep>) {
        const game_model = this.model.enterGame();
        return GameCtrl.preEnter(data, game_model);
    }
    public enterArenaGame(data: Partial<RoomInRep>) {
        const game_model = this.model.enterGame();
        return ArenaCtrl.preEnter(data, game_model);
    }
}
