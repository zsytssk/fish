import honor from 'honor';

import GameConfig from '@app/GameConfig';
import { Config } from '@app/data/config';
import { font_list, res } from '@app/data/res';
import { ServerEvent, ServerName } from '@app/data/serverEvent';
import { AppModel } from '@app/model/appModel';
import { sleep } from '@app/utils/animate';
import { BgMonitor } from '@app/utils/bgMonitor';
import { KeyBoardNumber } from '@app/utils/layaKeyboard';

import { GameCtrl as ArenaCtrl } from './arena/gameCtrl';
import { ctrlState } from './ctrlState';
import { AudioCtrl } from './ctrlUtils/audioCtrl';
import { GameCtrl } from './game/gameCtrl';
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
        const task1 = honor.director.setLoadPageForScene(
            'scenes/loading.scene',
        );
        const task2 = honor.director
            .load([...res.common, ...res.font], 'Scene')
            .then(() => {
                honor.utils.registerFontSize(font_list);
            });

        await Promise.all([task1, task2]);
    }
    public enterGame(data: Partial<RoomInRep>) {
        const game_model = this.model.enterGame();
        return GameCtrl.preEnter(data, game_model);
    }
    public enterGrandPrix(data: Partial<RoomInRep>) {
        const game_model = this.model.enterGame();
        return ArenaCtrl.preEnter(data, game_model);
    }
}
