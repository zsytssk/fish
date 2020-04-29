import { createSkeleton, createImg } from 'honor/utils/createSkeleton';
import { getSpriteInfo, getShadowInfo } from 'utils/dataUtil';
import { FishSpriteInfo } from 'data/sprite';
import { createRedFilter, playSkeleton, stopSkeleton } from 'utils/utils';
import { vectorToDegree } from 'utils/mathUtils';
import { Sprite } from 'laya/display/Sprite';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { createSkeletonPool, recoverSkeletonPool } from 'view/viewStateUtils';
import { ShadowItemInfo } from 'data/coordinate';

export type FishViewInfo = {
    type: string;
    id: string;
};
export class FishView extends Sprite {
    private fish_ani: Skeleton;
    private shadow_node: Sprite;
    public info: FishViewInfo;
    public shadow_info: ShadowItemInfo;
    private pool: Sprite;
    private time_out: number;
    private turn_ani: boolean;
    private turn_ani_name: string;
    constructor(info: FishViewInfo, pool: Sprite) {
        super();
        this.info = info;
        this.pool = pool;
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this.visible = false;

        (window as any).fish = this;
    }
    /** 创建 ani and shadow */
    private initAni() {
        const { pool } = this;
        if (this.fish_ani) {
            return;
        }
        const { type } = this.info;
        const fish_ani = createSkeletonPool('fish', type) as Skeleton;
        const { offset, turn_ani } = getSpriteInfo(
            'fish',
            type,
        ) as FishSpriteInfo;
        const [top, right, bottom, left] = offset;
        const width = right + left;
        const height = top + bottom;
        const pivot_x = left;
        const pivot_y = top;
        this.size(width, height);

        this.pivot(pivot_x, pivot_y);
        fish_ani.pos(pivot_x, pivot_y);
        this.addChild(fish_ani);
        playSkeleton(fish_ani, 0, true);
        this.fish_ani = fish_ani;
        this.turn_ani = turn_ani;
        const shadow = createImg(`image/game/shadow`);
        shadow.pivot(shadow.texture.width / 2, shadow.texture.height / 2);
        pool.addChild(shadow);

        const shadow_info = getShadowInfo(type);
        this.shadow_node = shadow;
        this.shadow_info = shadow_info;
        if (shadow_info.scaleX || shadow_info.scaleY) {
            shadow.scale(shadow_info.scaleX || 1, shadow_info.scaleY || 1);
        }

        this.zOrder = Number(type);
    }
    /** 创建 ani and shadow */
    public playSwimAni() {
        const { fish_ani, turn_ani_name } = this;
        if (fish_ani) {
            const name = turn_ani_name || 0;
            playSkeleton(fish_ani, name, true);
        }
    }
    /** 创建 ani and shadow */
    public stopSwimAni() {
        const { fish_ani } = this;
        if (fish_ani) {
            stopSkeleton(fish_ani);
        }
    }
    /** 设置显示状态 */
    public setVisible(visible: boolean) {
        this.visible = visible;
        if (visible) {
            this.initAni();
            this.playSwimAni();
        } else {
            this.stopSwimAni();
        }
    }
    /** 同步位置 */
    public syncPos(pos: Point, velocity: SAT.Vector, horizon_turn: boolean) {
        const { turn_ani, fish_ani, visible, shadow_node, shadow_info } = this;

        if (!visible) {
            return;
        }
        const angle = vectorToDegree(velocity) + 90;
        if (horizon_turn) {
            /** angle(-90 - 90) + 90 = 0-180 */
            const need_scale_x = angle > 0 && angle < 180;
            if (turn_ani) {
                const ani_name = need_scale_x ? 'right' : 'left';
                if (this.turn_ani_name !== ani_name) {
                    this.turn_ani_name = ani_name;
                    playSkeleton(fish_ani, ani_name, true);
                }
            } else {
                const scale_x = need_scale_x ? -1 : 1;
                if (scale_x !== this.scaleX) {
                    this.scaleX = need_scale_x ? -1 : 1;
                }
            }
        } else {
            this.rotation = angle;
            shadow_node.rotation = angle + 90;
        }

        this.pos(pos.x, pos.y);
        shadow_node.pos(pos.x + shadow_info.x, pos.y + shadow_info.y);
    }
    public beCastAni() {
        return new Promise((resolve, reject) => {
            const { fish_ani } = this;
            if (!fish_ani) {
                return;
            }
            fish_ani.filters = [createRedFilter()];
            clearTimeout(this.time_out);
            this.time_out = setTimeout(() => {
                if (fish_ani.destroyed) {
                    return;
                }
                fish_ani.filters = [];
                resolve();
            }, 500) as any;
        });
    }
    public destroy() {
        const { type } = this.info;

        this.fish_ani.filters = [];
        recoverSkeletonPool('fish', type, this.fish_ani);

        clearTimeout(this.time_out);
        super.destroy();
    }
}
