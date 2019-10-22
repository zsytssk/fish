import { ComponentManager } from 'comMan/component';
import { BulletModel, BulletProps } from './bulletModel';
import { GunModel } from './gunModel';
import { TrackTarget } from 'model/com/moveCom/moveTrackCom';
import { FishModel } from 'model/fishModel';

export class BulletGroup extends ComponentManager {
    public bullet_list: Set<BulletModel> = new Set();
    private gun: GunModel;
    /** 是否已经捕捉到了, 只处理第一个bulletModel捕的鱼 */
    private casted = false;
    constructor(
        bullets_pos: Point[],
        velocity: SAT.Vector,
        gun: GunModel,
        track?: TrackTarget,
    ) {
        super();
        this.gun = gun;
        this.initBullet(bullets_pos, velocity, track);
    }
    private initBullet(
        bullets_pos: Point[],
        velocity: SAT.Vector,
        track?: TrackTarget,
    ) {
        const { skin, level, level_skin } = this.gun;
        for (const pos of bullets_pos) {
            const bullet_props = {
                skin,
                pos,
                level,
                track,
                level_skin,
                velocity: velocity.clone(),
                cast_fn: this.castFn,
            } as BulletProps;
            const bullet = new BulletModel(bullet_props);
            this.bullet_list.add(bullet);
        }
    }
    private castFn = (fish: FishModel) => {
        const { gun, casted, bullet_list } = this;
        if (casted) {
            return;
        }
        this.casted = true;
        gun.castFish(fish);
        gun.removeBullet(this);
        this.gun = undefined;
        for (const bullet of bullet_list) {
            bullet.addNet();
        }
        bullet_list.clear();
    }; //tslint:disable-line
}
