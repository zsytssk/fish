import { FishModel } from 'model/fishModel';
import { BulletGroup } from 'model/gun/bulletGroup';
import { GunEvent } from 'model/gun/gunModel';
import { PlayerModel } from 'model/playerModel';
import SAT from 'sat';
import GunBox from 'view/scenes/game/gunBoxView';
import { getPoolMousePos } from 'view/viewState';
import { BulletCtrl } from './bulletCtrl';

/** 玩家的控制器 */
export class PlayerCtrl {
    /**
     * @param view 玩家对应的动画
     * @param model 玩家对应的model
     */
    constructor(private view: GunBox, private model: PlayerModel) {
        this.init();
    }
    private init() {
        this.initGun();
        this.initEvent();
    }
    private initGun() {
        const { view, model } = this;
        const { server_index, gun } = model;
        const { pos } = gun;
        if (server_index > 2) {
            view.rotation = 180;
        }
        view.setPos(pos.x, pos.y);
    }
    private initEvent() {
        const {
            view,
            model: { gun, is_cur_player },
        } = this;
        const { event } = gun;

        event.on(
            GunEvent.AddBullet,
            (bullet_group: BulletGroup, velocity: SAT.Vector) => {
                const { rage } = gun;
                view.fire(velocity);
                for (const bullet of bullet_group.bullet_list) {
                    const bullet_view = view.addBullet(
                        bullet.skin,
                        rage,
                    ) as Laya.Skeleton;
                    const bullet_ctrl = new BulletCtrl(bullet_view, bullet);
                }
            },
        );
        event.on(GunEvent.DirectionChange, (direction: SAT.Vector) => {
            view.setDirection(direction);
        });

        /** 当前用户的处理 */
        if (!is_cur_player) {
            return;
        }
        event.on(GunEvent.CastFish, (fish: FishModel) => {
            console.log(`cast fish:`, fish);
        });
        Laya.stage.on(Laya.Event.CLICK, view, (e: Laya.Event) => {
            const gun_pos = gun.pos;
            const click_pos = getPoolMousePos();
            const direction = new SAT.Vector(
                click_pos.x - gun_pos.x,
                click_pos.y - gun_pos.y,
            );
            gun.preAddBullet(direction);
        });
    }
}
