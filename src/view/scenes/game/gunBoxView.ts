import { LevelInfo } from 'model/game/gun/gunModel';
import { asyncQue, clearAsyncQue } from 'utils/asyncQue';
import { getGunSkinMap } from 'utils/dataUtil';
import { vectorToDegree } from 'utils/mathUtils';
import {
    playSkeleton,
    playSkeletonOnce,
    stopSkeleton,
    utilSkeletonLoadUrl,
} from 'utils/utils';
import { ui } from '../../../ui/layaMaxUI';
import { addBullet, viewState } from '../../viewState';
import { activePosTip, stopPosTip } from './ani_wrap/posTip';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { GlowFilter } from 'laya/filters/GlowFilter';

/** 炮台的view */
export default class GunBoxView extends ui.scenes.game.gunBoxUI {
    private time_out: number;
    public gun_skin: string;
    private gun_direct: SAT.Vector;
    constructor() {
        super();
    }
    public onEnable() {
        this.init();
        this.setDirection(this.gun_direct);
    }
    private init() {
        const { light, gun, base, body } = this;

        stopSkeleton(light);
        stopSkeleton(base);
        playSkeleton(gun, 'standby', true);
        playSkeleton(body, 'standby', true);
    }

    public setMySelfStyle() {
        const { ctrl_box } = this;
        ctrl_box.visible = true;
        this.activePosTip();
    }

    /** 设置动画 */
    public setBulletCost(level_info: LevelInfo) {
        const { skin, level_skin, bullet_cost } = level_info;
        const { gun, score_label } = this;

        score_label.text = bullet_cost + '';
        this.gun_skin = skin;

        const ani_list = ['base', 'light', 'body'];
        const ani_map = getGunSkinMap(skin, level_skin);
        const not_show_arr = ani_list.filter(item => {
            return !ani_map.has(item);
        });
        let gun_skin: string;
        for (const [ani_name, ani_id] of ani_map) {
            const name = `${ani_name}${ani_id}`;
            const ani_node = this[ani_name] as Skeleton;
            if (ani_name === 'gun') {
                gun_skin = name;
            }
            if (ani_name === 'light') {
                if (skin === '3') {
                    ani_node.alpha = 0.6;
                }
            }
            ani_node.url = `ani/gun/${name}.sk`;
            ani_node.visible = true;
        }
        for (const not_ani_name of not_show_arr) {
            const item = this[not_ani_name];
            item.visible = false;
            if (item instanceof Skeleton) {
                stopSkeleton(this[not_ani_name]);
            }
        }
        utilSkeletonLoadUrl(gun, `ani/gun/${gun_skin}.sk`).then(() => {
            playSkeleton(gun, 'standby', true);
        });
    }
    public fixServerTopPos() {
        const { ani_box, ctrl_wrap } = this;
        ani_box.rotation = this.rotation = 180;
        ctrl_wrap.scaleX = -1;
    }
    public fixClientTopPos() {
        const { ctrl_wrap } = this;
        ctrl_wrap.scaleY = -1;
    }
    public setDirection(direction: SAT.Vector) {
        if (!direction) {
            return;
        }
        const { gun } = this;
        const degree = vectorToDegree(direction) + 90;
        gun.rotation = degree;

        this.gun_direct = direction;
        /** 将因为皮肤 而需要特殊处理的逻辑 独立出来 */
        setGunDirection(this, degree);
    }
    /** 开火: 设置炮台方向+开火动画 */
    public fire(direction: SAT.Vector, userOnlyKey: string) {
        const { gun } = this;
        const name = `${userOnlyKey}:fire`;

        /** 为了防止fire动画被打断, 需要将动画放在队列中一个个执行 */
        asyncQue(name, () => {
            return playSkeletonOnce(gun, 'fire');
        }).then((is_last: boolean) => {
            if (is_last) {
                playSkeleton(gun, 'standby', true);
            }
        });

        /** 如果只是将动画放在队列中, 那么可能在子弹发射完成之后 fire动画还在一个个执行
         * 为了防止这种情形需要在最后一次fire调用之后 清理剩余的动画...
         * setTimeout 还是不完美...
         */
        clearTimeout(this.time_out);
        this.time_out = setTimeout(() => {
            clearAsyncQue(`${userOnlyKey}:fire`);
        }, 250) as any;
        this.setDirection(direction);
    }
    public addBullet(skin: string, rage: boolean) {
        return addBullet(skin, rage);
    }
    public detectDisableChangeBulletCost() {}
    /** 当前玩家的位置展示 */
    public activePosTip() {
        const pos_tip = activePosTip();
        this.addChild(pos_tip);
        pos_tip.pos(this.width / 2, this.height / 2);
    }
    public stopPosTip() {
        stopPosTip();
    }
    public setPos(x: number, y: number) {
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
