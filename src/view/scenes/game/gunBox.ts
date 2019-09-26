import { createSprite } from 'utils/dataUtil';
import { vectorToDegree } from 'utils/mathUtils';
import { stopSkeleton } from 'utils/utils';
import { ui } from '../../../ui/layaMaxUI';

export default class GunBox extends ui.scenes.game.gunBoxUI {
    private gun_skin: string;
    private pool: Laya.Sprite;
    constructor(gun_skin: string, pool: Laya.Sprite) {
        super();
        this.gun_skin = gun_skin;
        this.pool = pool;
        this.init();
    }
    private init() {
        const { ani } = this;
        stopSkeleton(ani);
    }
    public addBullet(skin: string, direction: SAT.Vector) {
        const { ani, pool } = this;
        ani.play(0, false);
        this.rotation = vectorToDegree(direction) + 90;
        const bullet = createSprite('bullet', skin);
        pool.addChild(bullet);
        return bullet;
    }
}
