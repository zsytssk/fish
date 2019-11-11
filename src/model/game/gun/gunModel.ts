import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { TimeoutCom } from 'comMan/timeoutCom';
import { Config } from 'data/config';
import * as SAT from 'sat';
import { getBulletStartPos, getGunLevelSkinInfo } from 'utils/dataUtil';
import { GunAutoLaunchCom } from '../com/gunAutoLaunchCom';
import { GunTrackFishCom } from '../com/gunTrackFishCom';
import { FishModel } from '../fishModel';
import { PlayerModel } from '../playerModel';
import { BulletGroup, BulletGroupInfo } from './bulletGroup';
import { TrackTarget } from '../com/moveCom/moveTrackCom';

export const GunEvent = {
    /** 通知ctrl添加子弹 -> 发送给服务端... */
    WillAddBullet: 'will_add_bullet',
    /** 添加子弹 */
    AddBullet: 'add_bullet',
    /** 方向改变 */
    DirectionChange: 'direction_change',
    /** 开关 */
    SwitchOn: 'switch_on',
    /** 加速状态 */
    SpeedUpStatus: 'speed_up_status',
    /** 网道鱼 */
    CastFish: 'cast_fish',
    /** 等级修改 */
    LevelChange: 'level_change',
};

export type LevelInfo = {
    bullet_cost: number;
    skin: string;
    level_skin: string;
    hole_num: number;
};

/** 添加子弹的信息 */
export type AddBulletInfo = {
    bullet_group: BulletGroup;
    velocity: SAT.Vector;
    track: TrackTarget;
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
    public bullet_cost: number;
    /** 炮皮肤 */
    public readonly skin: string;
    /** 炮皮肤 */
    public skin_level: string;
    /** 炮皮肤 */
    public hole_num: number;
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
    public launch_space = Config.LaunchSpace;
    /** 枪是否打开, 用来控制发射子弹的间隔 */
    private is_on = true;
    /** 枪是狂暴 */
    public rage = false;
    constructor(pos: Point, skin: string, player: PlayerModel) {
        super();

        this.pos = pos;
        this.skin = skin;
        this.player = player;
        this.init();
    }
    private init() {
        this.addCom(new EventCom(), new TimeoutCom());
        this.setBulletPrice(this.player.bullet_cost);
        this.initDirection();
    }
    public get event() {
        return this.getCom(EventCom);
    }
    private initDirection() {
        const { server_index } = this.player;
        if (server_index < 2) {
            this.setDirection(new SAT.Vector(0, -1));
            /** 炮台在下面, 方向为向上 */
        } else {
            this.setDirection(new SAT.Vector(0, 1));
            /** 炮台在下面, 方向为向下 */
        }
    }
    public setDirection(direction: SAT.Vector) {
        if (direction === this.direction) {
            return;
        }
        this.direction = direction;
        const timeout = this.getCom(TimeoutCom);
        timeout.createTimeout(() => {
            this.event.emit(GunEvent.DirectionChange, direction);
        }, this.launch_space);
    }
    public setBulletPrice(bullet_cost: number) {
        if (bullet_cost === this.bullet_cost) {
            return;
        }
        const { skin } = this;
        const { level_skin, hole_num } = getGunLevelSkinInfo(bullet_cost);
        this.bullet_cost = bullet_cost;
        this.skin_level = level_skin;
        this.hole_num = hole_num;

        const timeout = this.getCom(TimeoutCom);
        timeout.createTimeout(() => {
            this.event.emit(GunEvent.LevelChange, {
                bullet_cost,
                skin,
                level_skin,
                hole_num,
            } as LevelInfo);
        }, this.launch_space);
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
            this.launch_space = Config.LaunchSpace / 2;
        } else {
            /** 禁用 */
            this.launch_space = Config.LaunchSpace;
        }
    }
    /** 自动发射的处理 */
    public get autoLaunch() {
        let auto_launch = this.getCom(GunAutoLaunchCom);
        if (!auto_launch) {
            auto_launch = new GunAutoLaunchCom(this);
            this.addCom(auto_launch);
        }
        return auto_launch;
    }
    public get trackFish() {
        let track_fish = this.getCom(GunTrackFishCom);
        if (!track_fish) {
            track_fish = new GunTrackFishCom(this);
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

        this.event.emit(GunEvent.WillAddBullet, velocity);
        /** 枪隔一段时间才会打开 */
        this.is_on = false;
        const timeout = this.getCom(TimeoutCom);
        timeout.createTimeout(() => {
            this.is_on = true;
            this.event.emit(GunEvent.SwitchOn);
        }, this.launch_space);
    }
    public addBullet(direction: Point) {
        const {
            bullet_cost,
            skin,
            skin_level: level_skin,
            track_fish: track,
            player,
        } = this;
        const { x, y } = direction;

        const velocity = new SAT.Vector(x, y).normalize();
        this.setDirection(velocity);
        const bullets_pos = getBulletStartPos(
            this.player.server_index,
            velocity.clone(),
            `${skin}${level_skin}`,
        );
        const info: BulletGroupInfo = {
            bullets_pos,
            velocity,
            track,
        };
        const bullet_group = new BulletGroup(info, this);
        this.bullet_list.add(bullet_group);

        player.updateInfo({ bullet_num: player.bullet_num - bullet_cost });
        this.event.emit(GunEvent.AddBullet, {
            bullet_group,
            velocity,
            track,
        } as AddBulletInfo);
    }
    public castFish(fish: FishModel, level: number) {
        this.event.emit(GunEvent.CastFish, { fish, level });
    }
    public removeBullet(bullet: BulletGroup) {
        this.bullet_list.delete(bullet);
    }
    public destroy() {
        const { bullet_list } = this;

        for (const bullet of bullet_list) {
            bullet.destroy();
        }
        this.player = undefined;
        this.track_fish = undefined;
        this.setStatus(GunStatus.Normal);
        this.toggleSpeedUp(false);
        this.bullet_list.clear();

        super.destroy();
    }
}
