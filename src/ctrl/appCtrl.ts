import { Config } from 'data/config';
import { font_list, res } from 'data/res';
import GameConfig from 'GameConfig';
import honor from 'honor';
import { AppModel } from 'model/appModel';
import { ctrlState } from './ctrlState';
import { GameCtrl } from './game/gameCtrl';
// import honor from 'honor';
import { HallCtrl } from './hall/hallCtrl';
import { ServerName, ServerEvent } from 'data/serverEvent';
import { waitCreateSocket, onCreateSocket } from './net/webSocketWrapUtil';
import { Laya } from 'Laya';
import { sleep } from 'utils/animate';
import { BgMonitor } from 'utils/bgMonitor';
import { KeyBoardNumber } from 'utils/layaKeyboard';
import { gotoGuide } from './guide/guideConfig';
import { getItem } from 'utils/localStorage';

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
        onCreateSocket(ServerName.Hall).subscribe(socket => {
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
        await sleep(1);
        if (getItem('guide') !== 'end') {
            gotoGuide('1', '1');
        }
        // Loading.instance.event_com.on(Loading.)
    }
    /** 初始化 honor */
    private async startHonor() {
        await honor.run(GameConfig, {
            defaultVersion: Config.CdnVersion,
            versionPath: `./version.json?v=${Config.CdnVersion}`,
            basePath: Config.cndUrl,
        });
        // if (Laya.Browser.onIOS || Laya.Browser.onAndroid) {
        //     Laya.stage.fullScreenEnabled = true;
        // }
        const task1 = honor.director.setLoadPageForScene(
            'scenes/loading.scene',
        );
        // const task2 = honor.director.setLoadPageForDialog('scenes/loading.scene');
        const task2 = honor.director
            .load([...res.common, ...res.font], 'Scene')
            .then(() => {
                honor.utils.registerFontSize(font_list);
            });

        await Promise.all([task1, task2]);
    }
    public enterGame(url: string) {
        const game_model = this.model.enterGame();
        return GameCtrl.preEnter(url, game_model);
    }
}
