import * as SAT from 'sat';
import { FishModel, FishEvent, FishMoveData } from 'model/fishModel';
import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { GunModel, GunEvent, GunStatus } from 'model/gunModel';

export const TrackComEvent = {
    /** 开始追踪 */
    StartTrack: 'start_track',
    /** 停止追踪 */
    StopTrack: 'stop_track',
};

/** 追踪鱼 */
export class TrackFishCom extends ComponentManager {
    /** 追踪的鱼 */
    public fish: FishModel;
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
     */
    public track(fish: FishModel) {
        this.unTrack();
        const { gun } = this;
        const { event } = gun;
        event.on(
            GunEvent.SwitchOn,
            () => {
                gun.preAddBullet(gun.direction, true);
            },
            this,
        );

        this.fish = fish;
        this.setGunDirection();
        fish.event.on(FishEvent.Move, this.setGunDirection, this);
        gun.setStatus(GunStatus.TrackFish);
        gun.track_fish = fish;
        gun.preAddBullet(gun.direction, true);
    }
    private setGunDirection = () => {
        const { gun, fish } = this;
        const { x, y } = fish.pos;
        const { x: gx, y: gy } = gun.pos;
        gun.setDirection(new SAT.Vector(x - gx, y - gy));
    }; // tslint:disable-line: semicolon
    public unTrack() {
        const { fish, gun } = this;
        if (!fish) {
            return;
        }
        gun.setStatus(GunStatus.Normal);
        gun.track_fish = undefined;
        gun.event.offAllCaller(this);
        fish.event.offAllCaller(this);
        this.fish = null;
    }
    public destroy() {
        const { gun } = this;
        this.unTrack();
        gun.delCom(this);
        this.gun = undefined;
    }
}
