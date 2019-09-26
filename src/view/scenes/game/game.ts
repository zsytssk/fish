import honor from 'honor';
import { createSkeleton } from 'honor/utils/createSkeleton';
import { ui } from '../../../ui/layaMaxUI';
import GunBox from './gunBox';

export default class Game extends ui.scenes.game.gameUI {
    public static preEnter() {
        return honor.director.runScene(
            'scenes/game/game.scene',
            '参数1',
            '参数2',
        );
    }
    public onEnable() {
        const { pool } = this;
        pool.graphics.drawRect(0, 0, pool.width, pool.height, '#fff');
    }
    public addFish(type: string) {
        const { pool } = this;
        const fish = createSkeleton('ani/fish/fish' + type);
        pool.addChild(fish);
        return fish;
    }
    public addGun(level: string) {
        const { pool } = this;
        const gun = new GunBox(level, pool);
        pool.addChild(gun);
        return gun;
    }
}
