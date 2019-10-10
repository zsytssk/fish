import { vectorToDegree } from 'utils/mathUtils';
import { stopSkeleton } from 'utils/utils';
import { ui } from '../../../ui/layaMaxUI';
import { addBullet } from '../../viewState';

export default class GunBox extends ui.scenes.game.gunBoxUI {
    private gun_skin: string;
    constructor(gun_skin: string) {
        super();
        this.gun_skin = gun_skin;
        this.init();
    }
    private init() {
        const { ani } = this;
        stopSkeleton(ani);
    }
    public addBullet(skin: string, direction: SAT.Vector) {
        const { ani } = this;
        ani.play(0, false);
        this.rotation = vectorToDegree(direction) + 90;
        return addBullet(skin);
    }
}
