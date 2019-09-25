import { config } from 'data/config';
import GameConfig from 'GameConfig';
import honor from 'honor';
import { HallCtrl } from './start/hallCtrl';
import { AppModel } from 'model/appModel';
import { state } from './state';

export class AppCtrl {
    private model = new AppModel();
    constructor() {
        this.startApp();
    }
    public startApp() {
        state.app_ctrl = this;
        state.app_model = this.model;
        return this.startHonor().then(() => {
            HallCtrl.preEnter();
        });
    }
    /** 初始化 honor */
    private async startHonor() {
        await honor.run(GameConfig, {
            defaultVersion: config.cdn_version,
        });

        const task1 = honor.director.setLoadPageForScene(
            'scenes/loading.scene',
        );
        // const task2 = honor.director.setLoadPageForDialog('scenes/loading.scene');
        await Promise.all([task1]);
    }
}
