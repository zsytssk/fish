import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { FishEvent, FishModel } from 'model/game/fishModel';
import {
    GunEvent,
    GunModel,
    GunStatus,
    AddBulletInfo,
} from 'model/game/gun/gunModel';
import * as SAT from 'sat';
import { BulletGroup, BulletGroupEvent } from '../gun/bulletGroup';

export type StartTrackInfo = {
    fish: FishModel;
    fire: boolean;
};
export const GunTrackFishEvent = {
    /** 开始追踪 */
    StartTrack: 'start_track',
    /** 停止追踪 */
    StopTrack: 'stop_track',
};

/** 追踪鱼com */
export class GunTrackFishCom extends ComponentManager {
    /** 追踪的鱼 */
    public fish: FishModel;
    public bullet_list: Set<BulletGroup> = new Set();
    private gun: GunModel;
    constructor(gun: GunModel) {
        super();
        this.gun = gun;
    }
    public get event() {
        let event_com = this.getCom(EventCom);
        if (!event_com) {
            event_com = new EventCom();
            this.addCom(event_com);
        }
        return event_com;
    }
    /**
     * 追踪的鱼
     * @param fish 追踪的鱼
     * @param fire 是否开火, 不开火时只提示用户选中鱼
     */
    public track(fish: FishModel, fire: boolean) {
        const { gun } = this;
        const { event: gun_event } = gun;

        this.unTrack();
        if (fire) {
            this.bindTrackFish(fish);
        }
        gun_event.emit(GunTrackFishEvent.StartTrack, { fish, fire });
    }
    /** 监听锁定鱼事件 */
    private bindTrackFish(fish: FishModel) {
        const { gun } = this;
        const { event: gun_event } = gun;
        const { event: fish_event } = fish;

        this.fish = fish;
        gun.track_fish = fish;
        this.onTrackMove();
        fish_event.on(FishEvent.Move, this.onTrackMove, this);
        fish_event.on(FishEvent.Destroy, this.unTrack, this);
        gun.setStatus(GunStatus.TrackFish);

        gun.preAddBullet(gun.direction, true);
        gun_event.on(
            GunEvent.SwitchOn,
            () => {
                gun.preAddBullet(gun.direction, true);
            },
            this,
        );
        /** 收集 track fish 的子弹 在鱼销毁的时候需要还原
         */
        gun_event.on(
            GunEvent.AddBullet,
            (info: AddBulletInfo) => {
                if (info.track) {
                    const { bullet_group } = info;
                    this.bullet_list.add(bullet_group);
                    /** 子弹销毁的时候需要冲列表中销毁... */
                    bullet_group.event.on(BulletGroupEvent.Destroy, () => {
                        this.bullet_list.delete(bullet_group);
                    });
                }
            },
            this,
        );
    }
    /** 监听track目标位置改变 */
    private onTrackMove = () => {
        const { gun, fish } = this;
        const { x, y } = fish.pos;
        const { x: gx, y: gy } = gun.pos;
        gun.setDirection(new SAT.Vector(x - gx, y - gy));
    }; // tslint:disable-line: semicolon
    public unTrack = () => {
        const { fish, gun, bullet_list } = this;
        const { player } = gun;
        if (!fish) {
            return;
        }
        let bullets_cost = 0;
        for (const bullet of bullet_list) {
            const { bullet_cost } = bullet;
            bullets_cost += bullet_cost;
            bullet.destroy();
        }
        player.updateInfo({
            bullet_num: player.bullet_num + bullets_cost,
        });
        bullet_list.clear();

        gun.event.emit(GunTrackFishEvent.StopTrack);
        gun.setStatus(GunStatus.Normal);
        gun.track_fish = undefined;
        gun.event.offAllCaller(this);
        fish.event.offAllCaller(this);
        this.fish = null;
    }; // tslint:disable-line: semicolon
    public destroy() {
        const { gun } = this;
        this.unTrack();
        gun.delCom(this);
        this.gun = undefined;
    }
}
