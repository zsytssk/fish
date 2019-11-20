import { createSkeleton } from 'honor/utils/createSkeleton';
import { getSpriteInfo } from 'utils/dataUtil';
import { FishSpriteInfo } from 'data/sprite';
import { createRedFilter, playSkeleton, stopSkeleton } from 'utils/utils';
import { vectorToDegree } from 'utils/mathUtils';

export type FishViewInfo = {
    type: string;
    id: string;
};
export class FishView extends Laya.Sprite {
    private fish_ani: Laya.Skeleton;
    private shadow_node: Laya.Sprite;
    public info: FishViewInfo;
    private pool: Laya.Sprite;
    private time_out: number;
    private turn_ani: boolean;
    private turn_ani_name: string;
    constructor(info: FishViewInfo, pool: Laya.Sprite) {
        super();
        this.info = info;
        this.pool = pool;
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this.visible = false;
    }
    /** 创建 ani and shadow */
    private initAni() {
        if (this.fish_ani) {
            return;
        }
        const { type } = this.info;
        const fish_ani = createSkeleton('ani/fish/fish' + type);
        const { offset, turn_ani } = getSpriteInfo(
            'fish',
            type,
        ) as FishSpriteInfo;
        const [top, right, bottom, left] = offset;
        const width = right + left;
        const height = top + bottom;
        const pivot_x = top;
        const pivot_y = left;
        this.size(width, height);
        this.pivot(pivot_x, pivot_y);
        fish_ani.pos(pivot_x, pivot_y);
        this.addChild(fish_ani);
        playSkeleton(fish_ani, 0, true);
        this.fish_ani = fish_ani;
        this.turn_ani = turn_ani;
    }
    /** 创建 ani and shadow */
    public playSwimAni() {
        const { fish_ani } = this;
        if (fish_ani) {
            playSkeleton(fish_ani, 0, true);
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
        const { turn_ani, fish_ani } = this;
        const angle = vectorToDegree(velocity) + 90;
        if (horizon_turn) {
            /** angle(-90 - 90) + 90 = 0-180 */
            const need_scale_x = angle > 0 && angle < 180;
            if (turn_ani) {
                const ani_name = need_scale_x ? 'right' : 'left';
                if (this.turn_ani_name !== ani_name) {
                    console.log(need_scale_x);
                    this.turn_ani_name = ani_name;
                    fish_ani.play(ani_name, true);
                }
            } else {
                const scale_x = need_scale_x ? -1 : 1;
                if (scale_x !== this.scaleX) {
                    this.scaleX = need_scale_x ? -1 : 1;
                }
            }
        } else {
            this.rotation = angle;
        }

        this.pos(pos.x, pos.y);
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
        clearTimeout(this.time_out);
        super.destroy();
    }
}
