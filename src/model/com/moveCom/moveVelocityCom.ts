import { Displace, DisplaceInfo } from 'utils/displace/displace';
import { clearAll, loop } from 'utils/zTimer';

type MoveUpdateFn = (displace_info: DisplaceInfo) => void;

/** 速度 移动控制 */
export class MoveVelocityCom {
    private pos: Point;
    private velocity: SAT.Vector;
    constructor(pos: Point, velocity: SAT.Vector, update_fn: MoveUpdateFn) {
        this.pos = pos;
        this.velocity = velocity;

        loop(this.update.bind(this), 30, this);
    }
    public update(t: number) {}
    public changeVelocity(new_vel: SAT.Vector) {}
    public destroy() {
        clearAll(this);
    }
}
