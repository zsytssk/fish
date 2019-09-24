import { config } from 'data/config';
import GameConfig from 'GameConfig';
import honor from 'honor';
import { StartCtrl } from './start/startCtrl';

export class AppCtrl {
    constructor() {
        this.startHonor().then(() => {
            StartCtrl.preEnter();
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
