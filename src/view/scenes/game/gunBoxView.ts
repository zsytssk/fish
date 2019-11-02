import { LevelInfo } from 'model/game/gun/gunModel';
import { getSpriteInfo, getGunSkinMap } from 'utils/dataUtil';
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
        this.gun_skin = skin;

        const ani_list = ['base', 'light', 'body'];
        const ani_map = getGunSkinMap(skin, level_skin);
        const not_show_arr = ani_list.filter(item => {
            return !ani_map.has(item);
        });
        let gun_skin: string;
        for (const [ani_name, ani_id] of ani_map) {
            const name = `${ani_name}${ani_id}`;
            const ani_node = this[ani_name];
            if (ani_name === 'gun') {
                gun_skin = name;
            }
            ani_node.url = `ani/gun/${name}.sk`;
            ani_node.visible = true;
        }
        for (const not_ani_name of not_show_arr) {
            this[not_ani_name].visible = false;
        }
        utilSkeletonLoadUrl(gun, `ani/gun/${gun_skin}.sk`).then(() => {
            playSkeleton(gun, 'standby', true);
        });
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
export function setGunDirection(gun_box: GunBoxView, degree: number) {
    const { gun_skin, body } = gun_box;
    if (gun_skin === '5') {
        body.rotation = degree;
    }
}
