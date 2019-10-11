import { vectorToDegree } from 'utils/mathUtils';
import { stopSkeleton, playSkeleton } from 'utils/utils';
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
    public setDirection(direction: SAT.Vector) {
        this.rotation = vectorToDegree(direction) + 90;
    }
    public addBullet(skin: string, direction: SAT.Vector) {
        const { ani } = this;
        playSkeleton(ani, 0, false);
        this.setDirection(direction);
        return addBullet(skin);
    }
}
