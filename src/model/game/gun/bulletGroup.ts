import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

import { LockTarget } from '@app/model/game/com/moveCom/lockMoveCom';
import { FishModel } from '@app/model/game/fish/fishModel';
import { ModelEvent } from '@app/model/modelEvent';
import { genRandomStr } from '@app/utils/utils';

import { BulletInfo, BulletModel } from './bulletModel';
import { GunModel } from './gunModel';

export type BulletGroupInfo = {
    bullets_pos: Point[];
    velocity: SAT.Vector;
    lock?: LockTarget;
};

export const BulletGroupEvent = {
    Destroy: ModelEvent.Destroy,
};

/** 子弹组合(一次发射多个子弹, 一颗子弹击中鱼, 所有同时生成网) */
export class BulletGroup extends ComponentManager {
    public bullet_map: Map<number, BulletModel> = new Map();
    private gun: GunModel;
    public bullet_cost: number;
    /** 是否已经捕捉到了, 只处理第一个bulletModel捕的鱼 */
    private casted = false;
    public event: EventCom;
    public id = genRandomStr();
    constructor(info: BulletGroupInfo, gun: GunModel) {
        super();
        this.bullet_cost = gun.bullet_cost;
        this.gun = gun;
        const event = new EventCom();
        this.event = event;
        this.addCom(event);
        this.initBullet(info);
    }
    public init() {
        const { bullet_map } = this;
        for (const [, bullet] of bullet_map) {
            bullet.init();
        }
    }
    private initBullet(info: BulletGroupInfo) {
        const { bullets_pos, lock, velocity } = info;
        const { skin, bullet_cost, skin_level } = this.gun;

        for (const [index, pos] of bullets_pos.entries()) {
            const bullet_props = {
                skin,
                pos,
                bullet_cost,
                lock,
                skin_level,
                velocity: velocity.clone(),
                cast_fn: this.castFn,
            } as BulletInfo;
            const bullet = new BulletModel(bullet_props);
            this.bullet_map.set(index, bullet);
        }
    }
    /** 一颗子弹击中鱼之后的处理 */
    private castFn = (fish: FishModel) => {
        const {
            gun,
            casted,
            bullet_map: bullet_list,
            bullet_cost: bullet_price,
        } = this;
        if (casted) {
            return;
        }
        const { is_cur_player, need_emit } = gun.player;
        this.casted = true;
        if (need_emit) {
            gun.castFish(fish, bullet_price);
        }
        gun.removeBullet(this);
        this.gun = undefined;
        for (const [, bullet] of bullet_list) {
            bullet.addNet(is_cur_player);
        }
        this.destroy();
    }; //tslint:disable-line

    public destroy() {
        if (this.destroyed) {
            return;
        }
        const { bullet_map } = this;
        for (const [, bullet] of bullet_map) {
            bullet.destroy();
        }
        bullet_map.clear();
        this.event.emit(BulletGroupEvent.Destroy);

        this.event = undefined;
        this.gun = undefined;
        this.bullet_cost = 0;

        super.destroy();
    }
}
