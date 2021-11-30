import GameConfig from 'GameConfig';
import honor from 'honor';

import { Config } from 'data/config';
import { font_list, res } from 'data/res';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { AppModel } from 'model/appModel';
import { sleep } from 'utils/animate';
import { BgMonitor } from 'utils/bgMonitor';
import { KeyBoardNumber } from 'utils/layaKeyboard';

import { ctrlState } from './ctrlState';
import { AudioCtrl } from './ctrlUtils/audioCtrl';
import { GameCtrl } from './game/gameCtrl';
// import honor from 'honor';
import { HallCtrl } from './hall/hallCtrl';
import { onCreateSocket } from './net/webSocketWrapUtil';

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
        onCreateSocket(ServerName.Hall).subscribe((socket) => {
            socket.event.on(ServerEvent.UserAccount, (data: UserAccountRep) => {
                model.initUserInfo(data);
            });
        });

        await this.startHonor();
        this.keyboard_number = new KeyBoardNumber();
        await sleep(0.5).then(() => {
            platform.hideLoading();
        });
        await HallCtrl.preEnter();
        AudioCtrl.init();
    }
    /** 初始化 honor */
    private async startHonor() {
        await honor.run(GameConfig, {
            defaultVersion: Config.CdnVersion,
            versionPath: `./version.json?v=${Config.CdnVersion}`,
            basePath: Config.cndUrl,
        });
        const task1 = honor.director.setLoadPageForScene('scenes/loading.scene');
        const task2 = honor.director.load([...res.common, ...res.font], 'Scene').then(() => {
            honor.utils.registerFontSize(font_list);
        });

        await Promise.all([task1, task2]);
    }
    public enterGame(data: Partial<RoomInRep>) {
        const game_model = this.model.enterGame();
        return GameCtrl.preEnter(data, game_model);
    }
}
