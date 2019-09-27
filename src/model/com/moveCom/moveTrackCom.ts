import { clearTick, createTick } from 'utils/tick';

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
    private tick_index: number;
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

        this.tick_index = createTick(this.update.bind(this));
    }
    private update(t: number) {
        console.log('update');
    }
    public destroy() {
        clearTick(this.tick_index);
    }
}
