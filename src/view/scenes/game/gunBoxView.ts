import { vectorToDegree } from 'utils/mathUtils';
import { stopSkeleton, playSkeleton } from 'utils/utils';
import { ui } from '../../../ui/layaMaxUI';
import { addBullet, viewState, convertPosToNode } from '../../viewState';

export default class GunBox extends ui.scenes.game.gunBoxUI {
    private gun_skin: string;
    constructor(gun_skin: string) {
        super();
        this.gun_skin = gun_skin;
        this.init();
    }
    private init() {
        const { light, gun, base, gun_skin } = this;
        stopSkeleton(light);
        stopSkeleton(base);
        playSkeleton(gun, 'standby', true);
        light.visible = false;
        base.url = `ani/gun/gun${gun_skin}/base.sk`;
        light.url = `ani/gun/gun${gun_skin}/light.sk`;
        gun.url = `ani/gun/gun${gun_skin}/gun.sk`;
    }
    public setDirection(direction: SAT.Vector) {
        this.rotation = vectorToDegree(direction) + 90;
    }
    public fire(direction: SAT.Vector) {
        const { gun } = this;
        playSkeleton(gun, 'fire', false);
        this.setDirection(direction);
    }
    public addBullet(skin: string, rage: boolean) {
        return addBullet(skin, rage);
    }
    public setPos(x: number, y: number) {
        const { pool, ctrl_box } = viewState.game;
        const pos = convertPosToNode(new Laya.Point(x, y), pool, ctrl_box);
        this.pos(pos.x, pos.y);
    }
}
