import { ComponentManager } from 'comMan/component';
import { TrackTarget, MoveTrackCom } from './com/moveCom/moveTrackCom';
import { MoveVelocityCom } from './com/moveCom/moveVelocityCom';
import { EventCom } from 'comMan/eventCom';
import { getShapes } from './com/bodyComUtil';
import { BodyCom } from './com/bodyCom';
import { GunModel } from './gunModel';
import { ModelEvent } from './modelEvent';
import { config } from 'data/config';

export const BulletEvent = {
    move: 'move',
};

/** 子弹数据类 */
export class BulletModel extends ComponentManager {
    /** 等级 */
    public level: number;
    /** 等级 */
    public skin: string;
    /** 位置 */
    public pos: Point;
    /** 速度 */
    public velocity: SAT.Vector;
    private gun: GunModel;
    constructor(
        pos: Point,
        velocity: SAT.Vector,
        gun: GunModel,
        track?: TrackTarget,
    ) {
        super();

        this.level = gun.level;
        this.skin = gun.skin;
        this.pos = pos;
        this.velocity = velocity.scale(config.bullet_speed);
        this.gun = gun;
        this.init(track);
    }
    public get event() {
        return this.getCom(EventCom);
    }
    private init(track?: TrackTarget) {
        const { pos, velocity, level } = this;
        let move_com: MoveCom;
        if (track) {
            move_com = new MoveTrackCom(
                pos,
                velocity,
                track,
                this.onMoveChange.bind(this),
                this.onHit.bind(this),
            );
        } else {
            move_com = new MoveVelocityCom(
                pos,
                velocity,
                this.onMoveChange.bind(this),
            );
        }

        const shapes = getShapes('fish', level);
        const body_com = new BodyCom(shapes);

        this.addCom(new EventCom(), body_com, move_com);
    }
    private onMoveChange(move_info: MoveInfo) {
        const { pos, direction } = move_info;
        const body_com = this.getCom(BodyCom);
        body_com.update(pos, direction);

        this.event.emit(BulletEvent.move, {
            pos,
            direction,
        } as MoveInfo);
    }
    private onHit(track: TrackTarget) {
        console.log(track);
    }
    public destroy() {
        this.gun.removeBullet(this);
        this.event.emit(ModelEvent.Destroy);
        super.destroy();
    }
}
