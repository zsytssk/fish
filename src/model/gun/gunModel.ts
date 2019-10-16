import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { TimeoutCom } from 'comMan/timeoutCom';
import { config } from 'data/config';
import * as SAT from 'sat';
import { getBulletStartPos } from 'utils/dataUtil';
import { AutoLaunchCom } from '../com/autoLaunchCom';
import { TrackFishCom } from '../com/trackFishCom';
import { FishModel } from '../fishModel';
import { PlayerModel } from '../playerModel';
import { BulletGroup } from './bulletGroup';

export const GunEvent = {
    AddBullet: 'add_bullet',
    DirectionChange: 'direction_change',
    SwitchOn: 'switch_on',
    SpeedUpStatus: 'speed_up_status',
    CastFish: 'cast_fish',
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
    private bullet_list: Set<BulletGroup> = new Set();
    /** 所属的玩家 */
    public player: PlayerModel;
    /** 追踪的鱼 */
    public track_fish: FishModel;
    /** 炮台的状态 */
    public status = GunStatus.Normal;
    /** 是否加速  */
    public is_speedup = false;
    /** 是否加速  */
    public launch_space = config.launch_space;
    /** 枪是否打开, 用来控制发射子弹的间隔 */
    private is_on = true;
    /** 枪是狂暴 */
    public rage = false;
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
    public toggleSpeedUp(is_speedup: boolean) {
        if (is_speedup === this.is_speedup) {
            return;
        }
        this.is_speedup = is_speedup;
        this.event.emit(GunEvent.SpeedUpStatus, is_speedup);
        if (is_speedup === true) {
            /** 开启 */
            this.launch_space = config.launch_space / 2;
        } else {
            /** 禁用 */
            this.launch_space = config.launch_space;
        }
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
    public get speedup() {
        let track_fish = this.getCom(TrackFishCom);
        if (!track_fish) {
            track_fish = new TrackFishCom(this);
            this.addCom(track_fish);
        }
        return track_fish;
    }
    public preAddBullet(velocity: SAT.Vector, force = false) {
        if (!force && this.status === GunStatus.TrackFish) {
            return;
        }
        velocity = velocity.clone().normalize();
        this.setDirection(velocity);

        if (!force && this.status === GunStatus.AutoLaunch) {
            return;
        }

        if (!this.is_on) {
            return;
        }

        this.addBullet(velocity);

        /** 枪隔一段时间才会打开 */
        this.is_on = false;
        const timeout = this.getCom(TimeoutCom);
        timeout.createTimeout(() => {
            this.is_on = true;
            this.event.emit(GunEvent.SwitchOn);
        }, this.launch_space);
    }
    public addBullet(velocity: SAT.Vector) {
        velocity = velocity.clone().normalize();
        this.setDirection(velocity);

        const bullets_pos = getBulletStartPos(
            this.player.server_index,
            velocity.clone(),
            this.skin,
        );
        const bullet_group = new BulletGroup(
            bullets_pos,
            velocity,
            this,
            this.track_fish,
        );
        this.bullet_list.add(bullet_group);

        this.event.emit(GunEvent.AddBullet, bullet_group, velocity);
    }
    public castFish(fish: FishModel) {
        fish.beCast();
        this.event.emit(GunEvent.CastFish, fish);
    }
    public removeBullet(bullet: BulletGroup) {
        this.bullet_list.delete(bullet);
    }
    public destroy() {
        super.destroy();
    }
}
