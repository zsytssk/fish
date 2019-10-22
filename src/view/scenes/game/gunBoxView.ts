import { vectorToDegree } from 'utils/mathUtils';
import { playSkeleton, stopSkeleton } from 'utils/utils';
import { ui } from '../../../ui/layaMaxUI';
import { addBullet, viewState } from '../../viewState';
import { activePosTip, stopPosTip } from './ani_wrap/posTip';
import { LevelInfo } from 'model/gun/gunModel';
import { getSpriteInfo } from 'utils/dataUtil';
import { GunSpriteInfo } from 'data/sprite';

/** 炮台的view */
export default class GunBoxView extends ui.scenes.game.gunBoxUI {
    private gun_skin: string;
    constructor() {
        super();
        this.init();
    }
    private init() {
        const { light, gun, base, score_box } = this;
        const { upside_down } = viewState.game;

        stopSkeleton(light);
        stopSkeleton(base);
        playSkeleton(gun, 'standby', true);
        light.visible = false;

        if (upside_down) {
            score_box.scaleX = -1;
        }
    }

    public setLevel(level_info: LevelInfo) {
        const { skin, level_skin, level } = level_info;
        const { light, gun, base, score_label } = this;
        const { has_base } = getSpriteInfo('gun', skin) as GunSpriteInfo;

        score_label.text = level + '';
        const gun_skin = `${skin}${level_skin}`;
        light.url = `ani/gun/light${gun_skin}.sk`;
        gun.url = `ani/gun/gun${gun_skin}.sk`;
        if (has_base) {
            base.visible = true;
            base.url = `ani/gun/base${gun_skin}.sk`;
        } else {
            base.visible = false;
        }
        playSkeleton(gun, 'standby', true);
    }
    public setDirection(direction: SAT.Vector) {
        this.rotation = vectorToDegree(direction) + 90;
    }
    /** 开火: 设置炮台方向+开火动画 */
    public fire(direction: SAT.Vector) {
        const { gun } = this;
        playSkeleton(gun, 'fire', false);
        this.setDirection(direction);
    }
    public addBullet(skin: string, rage: boolean) {
        return addBullet(skin, rage);
    }
    /** 当前玩家的位置展示 */
    public activePosTip() {
        const { upside_down } = viewState.game;
        const pos_tip = activePosTip();
        this.addChild(pos_tip);
        pos_tip.pos(this.width / 2, this.height / 2);
        if (upside_down) {
            pos_tip.scaleX = -1;
        }
    }
    public stopPosTip() {
        stopPosTip();
    }
    public setPos(x: number, y: number) {
        const { pool, ctrl_box } = viewState.game;
        // const pos = convertPosToNode(new Laya.Point(x, y), pool, ctrl_box);
        this.pos(x, y);
    }
}
