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
    constructor(info: FishViewInfo, pool: Laya.Sprite) {
        super();
        this.info = info;
        this.pool = pool;
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this.init();
    }
    /** 创建 ani and shadow */
    private init() {
        const { type } = this.info;
        const fish_ani = createSkeleton('ani/fish/fish' + type);
        const { offset } = getSpriteInfo('fish', type) as FishSpriteInfo;
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
    }
    /** 创建 ani and shadow */
    public playSwimAni() {
        const { fish_ani } = this;
        playSkeleton(fish_ani, 0, true);
    }
    /** 创建 ani and shadow */
    public stopSwimAni() {
        const { fish_ani } = this;
        stopSkeleton(fish_ani);
    }
    /** 同步位置 */
    public syncPos(pos: Point, velocity: SAT.Vector, horizon_turn: boolean) {
        const angle = vectorToDegree(velocity) + 90;
        if (horizon_turn) {
            /** angle(-90 - 90) + 90 = 0-180 */
            const need_scale_x = angle > 0 && angle < 180;
            this.scaleX = need_scale_x ? -1 : 1;
        } else {
            this.rotation = angle;
        }

        this.pos(pos.x, pos.y);
    }
    public beCastAni() {
        return new Promise((resolve, reject) => {
            const { fish_ani } = this;
            fish_ani.filters = [createRedFilter()];
            clearTimeout(this.time_out);
            this.time_out = setTimeout(() => {
                fish_ani.filters = [];
                resolve();
            }, 500) as any;
        });
    }
}
