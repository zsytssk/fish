import honor from 'honor';
import { createSkeleton } from 'honor/utils/createSkeleton';
import { ui } from 'ui/layaMaxUI';
import GunBox from './gunBox';
import { createSprite } from 'utils/dataUtil';
import { viewState } from '../../viewState';

export default class Game extends ui.scenes.game.gameUI {
    public static async preEnter() {
        const game = (await honor.director.runScene(
            'scenes/game/game.scene',
            '参数1',
            '参数2',
        )) as Game;
        viewState.game = game;
        return game;
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
    public addBullet(skin: string) {
        const { pool } = this;
        const bullet = createSprite('bullet', skin);
        pool.addChild(bullet);

        return bullet;
    }
    public addNet(skin: string) {
        const { pool } = this;
        const net = createSprite('net', skin);
        pool.addChild(net);
        return net;
    }
    public addGun(level: string) {
        const { pool } = this;
        const gun = new GunBox(level);
        pool.addChild(gun);
        return gun;
    }
    public getPoolMousePos() {
        const { pool } = this;
        return pool.getMousePoint();
    }
}
