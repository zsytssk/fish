import SAT from 'sat';
import { Displace, DisplaceInfo } from 'utils/displace/displace';
import { clearAll, loop } from 'utils/zTimer';
import { createTick, clearTick } from '../../../utils/tick';

type MoveUpdateFn = (displace_info: DisplaceInfo) => void;

/** 速度 移动控制 */
export class MoveVelocityCom {
    private pos: Point;
    private velocity: SAT.Vector;
    private update_fn: MoveUpdateFn;
    private tick_index: number;
    constructor(pos: Point, velocity: SAT.Vector, update_fn: MoveUpdateFn) {
        this.pos = pos;
        this.velocity = velocity;
        this.update_fn = update_fn;

        this.tick_index = createTick(this.update.bind(this));
    }
    public update(t: number) {
        const { pos, velocity } = this;
        pos.x += velocity.x * t;
        pos.y += velocity.y * t;
        this.detectHitWall();
        this.update_fn({ pos, direction: velocity });
    }
    public detectHitWall() {
        const velocity = this.velocity;
        const pos = this.pos;
        let { x, y } = velocity;
        // 如果x<0 || x>1334 velocity x 改变方向
        if (pos.x > 1334 || pos.x < 0) {
            if (pos.x > 1334) {
                pos.x = 1334 - (pos.x - 1334);
                x = -Math.abs(velocity.x);
            }
            if (pos.x < 0) {
                pos.x = -pos.x;
                x = Math.abs(velocity.x);
            }
        }
        // 如果y<0 || y>750 velocity y 改变方向
        if (pos.y > 750 || pos.y < 0) {
            if (pos.y > 750) {
                pos.y = 750 - (pos.y - 750);
                y = -Math.abs(velocity.y);
            }
            if (pos.y < 0) {
                pos.y = -pos.y;
                y = Math.abs(velocity.y);
            }
        }
        this.velocity = new SAT.Vector(x, y);
        this.pos = pos;
    }

    public destroy() {
        clearTick(this.tick_index);
    }
}
