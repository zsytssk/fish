import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { getBulletStartPos } from 'utils/dataUtil';
import { BulletModel } from './bulletModel';
import { TrackTarget } from './com/moveCom/moveTrackCom';
import { PlayerModel } from './playerModel';

export const GunEvent = {
    AddBullet: 'addBullet',
};
/** 炮台数据类 */
export class GunModel extends ComponentManager {
    /** 炮口的方向 */
    private direction: SAT.Vector;
    /** 位置 */
    public readonly pos: Point;
    /** 炮等级 */
    public level: number;
    /** 炮皮肤 */
    public readonly skin: string;
    /** 子弹列表 */
    private bullet_list: Set<BulletModel> = new Set();
    /** 炮口的方向 */
    public player: PlayerModel;
    constructor(pos: Point, skin: string, player: PlayerModel) {
        super();

        this.level = player.level;
        this.pos = pos;
        this.skin = skin;
        this.player = player;
        this.init();
    }
    private init() {
        const { level, skin } = this;
        this.addCom(new EventCom());
    }
    public get event() {
        return this.getCom(EventCom);
    }
    public addBullet(velocity: SAT.Vector, track?: TrackTarget) {
        velocity = velocity.clone().normalize();
        this.direction = velocity;

        const bullet_pos = getBulletStartPos(
            this.player.server_index,
            velocity,
        );
        const bullet = new BulletModel(bullet_pos, velocity, this, track);
        this.bullet_list.add(bullet);

        this.event.emit(GunEvent.AddBullet, bullet);
    }
    public removeBullet(bullet: BulletModel) {
        this.bullet_list.delete(bullet);
    }
    public destroy() {
        super.destroy();
    }
}
