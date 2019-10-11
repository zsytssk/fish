import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import * as SAT from 'sat';
import { getBulletStartPos } from 'utils/dataUtil';
import { BulletModel } from './bulletModel';
import { AutoLaunchCom } from './com/autoLaunchCom';
import { TrackFishCom } from './com/trackFishCom';
import { PlayerModel } from './playerModel';
import { FishModel } from './fishModel';
import { TimeoutCom } from 'comMan/timeoutCom';
import { config } from 'data/config';

export const GunEvent = {
    AddBullet: 'add_bullet',
    DirectionChange: 'direction_change',
    SwitchOn: 'switch_on',
};
export enum GunStatus {
    Normal,
    AutoLaunch,
    TrackFish,
}
/** 炮台数据类 */
export class GunModel extends ComponentManager {
    /** 炮口的方向 */
    public direction = new SAT.Vector(0, -1);
    /** 位置 */
    public readonly pos: Point;
    /** 炮等级 */
    public level: number;
    /** 炮皮肤 */
    public readonly skin: string;
    /** 子弹列表 */
    private bullet_list: Set<BulletModel> = new Set();
    /** 所属的玩家 */
    public player: PlayerModel;
    /** 追踪的鱼 */
    public track_fish: FishModel;
    /** 炮台的状态 */
    public status = GunStatus.Normal;
    /** 枪是否打开, 用来控制发射子弹的间隔 */
    private is_on = true;
    constructor(pos: Point, skin: string, player: PlayerModel) {
        super();

        this.level = player.level;
        this.pos = pos;
        this.skin = skin;
        this.player = player;
        this.init();
    }
    private init() {
        this.addCom(new EventCom());
        this.addCom(new TimeoutCom());
    }
    public setDirection(direction: SAT.Vector) {
        if (direction === this.direction) {
            return;
        }
        this.direction = direction;
        this.event.emit(GunEvent.DirectionChange, direction);
    }
    public get event() {
        return this.getCom(EventCom);
    }
    public setStatus(status: GunStatus) {
        if (status === this.status) {
            return;
        }
        this.status = status;
    }
    /** 自动发射的处理 */
    public get autoLaunch() {
        let auto_launch = this.getCom(AutoLaunchCom);
        if (!auto_launch) {
            auto_launch = new AutoLaunchCom(this);
            this.addCom(auto_launch);
        }
        return auto_launch;
    }
    public get trackFish() {
        let track_fish = this.getCom(TrackFishCom);
        if (!track_fish) {
            track_fish = new TrackFishCom(this);
            this.addCom(track_fish);
        }
        return track_fish;
    }
    public preAddBullet(velocity: SAT.Vector, force = false) {
        const timeout = this.getCom(TimeoutCom);
        if (!force && this.status !== GunStatus.Normal) {
            velocity = velocity.clone().normalize();
            this.setDirection(velocity);
            return;
        }

        if (!this.is_on) {
            return;
        }
        this.addBullet(velocity);

        /** 枪隔一段时间才会打开 */
        this.is_on = false;
        timeout.createTimeout(() => {
            this.is_on = true;
            this.event.emit(GunEvent.SwitchOn);
        }, config.launch_space);
    }
    public addBullet(velocity: SAT.Vector) {
        velocity = velocity.clone().normalize();
        this.setDirection(velocity);

        const bullet_pos = getBulletStartPos(
            this.player.server_index,
            velocity,
        );
        const bullet = new BulletModel(
            bullet_pos,
            velocity,
            this,
            this.track_fish,
        );
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
