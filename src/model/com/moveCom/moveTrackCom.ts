import { clearAll, loop } from 'utils/zTimer';

type MoveUpdateFn = (pos: Point, velocity: SAT.Vector) => void;
export interface TrackTarget {
    pos: Point;
}
export type OnHit = (target: TrackTarget) => void;
/** 追踪目标 移动控制 */
export class MoveTrackCom {
    private target: TrackTarget;
    private pos: Point;
    private velocity: SAT.Vector;
    private update_fn: MoveUpdateFn;
    private on_hit: OnHit;
    constructor(
        pos: Point,
        velocity: SAT.Vector,
        target: TrackTarget,
        update_fn: MoveUpdateFn,
        on_hit: OnHit,
    ) {
        this.target = target;
        this.pos = pos;
        this.velocity = velocity;
        this.update_fn = update_fn;
        this.on_hit = on_hit;

        loop(this.update.bind(this), 30, this);
    }
    private update(t: number) {
        console.log('update');
    }
    public destroy() {
        clearAll(this);
    }
}
