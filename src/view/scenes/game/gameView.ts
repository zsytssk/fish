import honor, { HonorScene } from 'honor';
import { createSkeleton } from 'honor/utils/createSkeleton';
import { ui } from 'ui/layaMaxUI';
import { createSprite, getSpriteInfo } from 'utils/dataUtil';
import { viewState } from '../../viewState';
import GunBox from './gunBoxView';
import { SpriteInfo } from 'data/sprite';

export default class Game extends ui.scenes.game.gameUI implements HonorScene {
    public static async preEnter() {
        const game = (await honor.director.runScene(
            'scenes/game/game.scene',
            '参数1',
            '参数2',
        )) as Game;
        viewState.game = game;
        return game;
    }
    public onResize(width: number, height: number) {
        const { width: tw, height: th } = this;
        this.x = (width - tw) / 2;
        this.y = (height - th) / 2;
    }
    public addFish(type: string) {
        const { pool } = this;
        const fish = createSkeleton('ani/fish/fish' + type);
        pool.addChild(fish);
        return fish;
    }
    public addBullet(skin: string, rage = false) {
        const { pool } = this;
        const { path } = getSpriteInfo('bullet', skin) as SpriteInfo;
        let bullet: Laya.Skeleton;
        if (!rage) {
            bullet = createSkeleton(path);
        } else {
            bullet = createSkeleton(`${path}_rage`);
        }
        pool.addChild(bullet);
        bullet.visible = false;
        return bullet;
    }
    public addNet(skin: string) {
        const { pool } = this;
        const net = createSprite('net', skin);
        pool.addChild(net);
        return net;
    }
    public addGun(level: string) {
        const { ctrl_box } = this;
        const gun = new GunBox(level);
        ctrl_box.addChild(gun);
        return gun;
    }
    public getPoolMousePos() {
        const { pool } = this;
        return pool.getMousePoint();
    }
}
