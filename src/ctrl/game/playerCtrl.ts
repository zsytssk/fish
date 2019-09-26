import SAT from 'sat';
import { BulletModel } from 'model/bulletModel';
import { GunEvent } from 'model/gunModel';
import { PlayerModel } from 'model/playerModel';
import GunBox from 'view/scenes/game/gunBox';
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
        view.pos(pos.x, pos.y);
    }
    private initEvent() {
        const {
            view,
            model: { gun },
        } = this;
        const { event } = gun;

        event.on(GunEvent.AddBullet, (bullet: BulletModel) => {
            const bullet_view = view.addBullet(
                bullet.skin,
                bullet.velocity,
            ) as Laya.Image;
            const bullet_ctrl = new BulletCtrl(bullet_view, bullet);
        });

        Laya.stage.on(Laya.Event.CLICK, view, (e: Laya.Event) => {
            const gun_pos = gun.pos;
            const click_pos = { x: e.stageX, y: e.stageY };
            const direction = new SAT.Vector(
                click_pos.x - gun_pos.x,
                click_pos.y - gun_pos.y,
            );
            gun.addBullet(direction);
        });
    }
}
