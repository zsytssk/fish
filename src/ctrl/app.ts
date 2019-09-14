import { config } from 'config/config';
import GameConfig from 'GameConfig';
import honor from 'honor';
import { LoginCtrl } from './start/loginCtrl';

export class AppCtrl {
    constructor() {
        this.startHonor().then(() => {
            LoginCtrl.preEnter();
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
