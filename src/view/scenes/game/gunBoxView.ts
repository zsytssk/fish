import { LevelInfo } from 'model/game/gun/gunModel';
import { getSpriteInfo } from 'utils/dataUtil';
import { vectorToDegree } from 'utils/mathUtils';
import {
    playSkeleton,
    stopSkeleton,
    utilSkeletonLoadUrl,
    playSkeletonOnce,
} from 'utils/utils';
import { ui } from '../../../ui/layaMaxUI';
import { addBullet, viewState } from '../../viewState';
import { activePosTip, stopPosTip } from './ani_wrap/posTip';
import { asyncQue, stopAsyncQue } from 'utils/asyncQue';

/** 炮台的view */
export default class GunBoxView extends ui.scenes.game.gunBoxUI {
    private time_out: number;
    public gun_skin: string;
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

        if (upside_down) {
            score_box.scaleX = -1;
        }
    }

    /** 设置动画 */
    public setLevel(level_info: LevelInfo) {
        const { skin, level_skin, level } = level_info;
        const { gun, score_label } = this;
        score_label.text = level + '';
        const gun_skin = `${skin}${level_skin}`;

        score_label.text = level + '';
        this.gun_skin = skin;
        utilSkeletonLoadUrl(gun, `ani/gun/gun${gun_skin}.sk`).then(() => {
            playSkeleton(gun, 'standby', true);
        });

        /** 将因为皮肤 而需要特殊处理的逻辑 独立出来 */
        setGunLevel(this, level_info);
    }
    public setDirection(direction: SAT.Vector) {
        const { gun } = this;
        const degree = vectorToDegree(direction) + 90;
        gun.rotation = degree;

        /** 将因为皮肤 而需要特殊处理的逻辑 独立出来 */
        setGunDirection(this, degree);
    }
    /** 开火: 设置炮台方向+开火动画 */
    public fire(direction: SAT.Vector, nickname: string) {
        const { gun } = this;
        const name = `${nickname}:fire`;

        /** 为了防止fire动画被打断, 需要将动画放在队列中一个个执行 */
        asyncQue(name, () => {
            return playSkeletonOnce(gun, 'fire');
        }).then((is_last: boolean) => {
            if (is_last) {
                playSkeletonOnce(gun, 'standby');
            }
        });

        /** 如果只是将动画放在队列中, 那么可能在子弹发射完成之后 fire动画还在一个个执行
         * 为了防止这种情形需要在最后一次fire调用之后 清理剩余的动画...
         * setTimeout 还是不完美...
         */
        clearTimeout(this.time_out);
        this.time_out = setTimeout(() => {
            stopAsyncQue(`${nickname}:fire`);
        }, 250) as any;
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
        // const pos = convertPosToNode(new Laya.Point(x, y), pool, ctrl_box);
        this.pos(x, y);
    }
}

/** 将因为皮肤 而需要特殊处理的逻辑 独立出来 */
export function setGunLevel(gun_box: GunBoxView, level_info: LevelInfo) {
    const { skin, level_skin } = level_info;
    const { light, base } = gun_box;
    const ani_arr = getSpriteInfo('gun', skin) as string[];
    const has_base = ani_arr.indexOf('base') !== -1;
    const has_light = ani_arr.indexOf('light') !== -1;

    const light_skin = `${skin}${level_skin}`;
    const base_skin = skin === '5' ? skin : `${skin}${level_skin}`;

    if (skin === '5') {
        base.zOrder = 10;
    }
    if (has_light) {
        light.visible = true;
        light.url = `ani/gun/light${light_skin}.sk`;
    } else {
        light.visible = false;
    }
    if (has_base) {
        base.visible = true;
        base.url = `ani/gun/base${base_skin}.sk`;
    } else {
        base.visible = false;
    }
}
/** 将因为皮肤 而需要特殊处理的逻辑 独立出来 */
export function setGunDirection(gun_box: GunBoxView, degree: number) {
    const { gun_skin, base } = gun_box;
    if (gun_skin === '5') {
        base.rotation = degree;
    }
}
