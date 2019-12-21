import { Config } from 'data/config';
import GameConfig from 'GameConfig';
// import honor from 'honor';
import { HallCtrl } from './hall/hallCtrl';
import { AppModel } from 'model/appModel';
import { ctrlState } from './ctrlState';
import { res, font_list } from 'data/res';
import honor from 'honor';
import { GameCtrl } from './game/gameCtrl';

/** 顶级 ctrl */
export class AppCtrl {
    public model: AppModel;
    constructor() {
        this.startApp();
    }
    public startApp() {
        ctrlState.app = this;
        const model = new AppModel();
        this.model = model;
        model.init();

        return this.startHonor().then(() => {
            HallCtrl.preEnter();
        });
    }
    /** 初始化 honor */
    private async startHonor() {
        await honor.run(GameConfig, {
            defaultVersion: Config.CdnVersion,
        });
        const task1 = honor.director.setLoadPageForScene(
            'scenes/loading.scene',
        );
        // const task2 = honor.director.setLoadPageForDialog('scenes/loading.scene');
        const task2 = honor.director
            .load([...res.font, ...res.audio])
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
