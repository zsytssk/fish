import { FishModel } from 'model/game/fishModel';
import { BulletGroup } from 'model/game/gun/bulletGroup';
import { GunEvent, LevelInfo, AddBulletInfo } from 'model/game/gun/gunModel';
import { PlayerModel, PlayerEvent, CaptureInfo } from 'model/game/playerModel';
import SAT from 'sat';
import { activeAimFish, stopAim } from 'view/scenes/game/ani_wrap/aim';
import GunBoxView from 'view/scenes/game/gunBoxView';
import {
    getPoolMousePos,
    getSkillItemByIndex,
    getAutoLaunchSkillItem,
    setBulletNum,
} from 'view/viewState';
import { BulletCtrl } from './bulletCtrl';
import { SkillCtrl } from './skill/skillCtrl';
import { AutoLaunchModel } from 'model/game/skill/autoLaunchModel';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { showAwardCoin } from 'view/scenes/game/ani_wrap/award/awardCoin';
import {
    GunTrackFishEvent,
    StartTrackInfo,
} from 'model/game/com/gunTrackFishCom';
import { changeNum } from 'utils/utils';

/** 玩家的控制器 */
export class PlayerCtrl {
    /**
     * @param view 玩家对应的动画
     * @param model 玩家对应的model
     */
    constructor(private view: GunBoxView, private model: PlayerModel) {
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
        if (server_index >= 2) {
            view.fixServerTopPos();
        }
        view.setPos(pos.x, pos.y);
    }
    private initEvent() {
        const {
            view,
            model: {
                nickname,
                gun,
                is_cur_player,
                skill_map,
                event: player_event,
            },
        } = this;
        const { event: gun_event, direction, pos: gun_pos } = gun;
        const { ctrl_box, btn_minus, btn_add } = view;

        player_event.on(PlayerEvent.CaptureFish, (data: CaptureInfo) => {
            const { pos, win, resolve } = data;
            const { pos: end_pos } = gun;
            showAwardCoin(pos, end_pos, win, is_cur_player).then(resolve);
        });
        gun_event.on(GunEvent.AddBullet, (info: AddBulletInfo) => {
            const { bullet_group, velocity } = info;
            const { rage } = gun;
            view.fire(velocity, nickname);
            view.stopPosTip();
            for (const bullet of bullet_group.bullet_list) {
                const bullet_view = view.addBullet(
                    bullet.skin,
                    rage,
                ) as Laya.Skeleton;
                const bullet_ctrl = new BulletCtrl(bullet_view, bullet);
            }
        });

        view.setDirection(direction);
        gun_event.on(GunEvent.DirectionChange, (_direction: SAT.Vector) => {
            view.setDirection(_direction);
        });
        gun_event.on(GunEvent.LevelChange, (level_info: LevelInfo) => {
            view.setBulletCost(level_info);
        });
        view.on(Laya.Event.CLICK, view, (e: Laya.Event) => {
            e.stopPropagation();
        });

        let index = 0;
        for (const [, skill_model] of skill_map) {
            if (skill_model instanceof AutoLaunchModel) {
                if (is_cur_player) {
                    const auto_launch_view = getAutoLaunchSkillItem();
                    this.handleAutoLaunch(skill_model, auto_launch_view);
                }
                continue;
            } else {
                if (is_cur_player) {
                    const skill_view = getSkillItemByIndex(index);
                    const skill_ctrl = new SkillCtrl(skill_model, skill_view);
                } else {
                    {
                        const skill_ctrl = new SkillCtrl(skill_model);
                    }
                }
            }
            index++;
        }

        /** 当前用户的处理 */
        if (!is_cur_player) {
            return;
        }
        ctrl_box.visible = true;
        const socket = getSocket('game');

        player_event.on(PlayerEvent.UpdateInfo, () => {
            const { bullet_num, bullet_cost } = this.model;
            console.log(`test:>UpdateInfo`, bullet_num);
            setBulletNum(bullet_num);
        });
        gun_event.on(
            GunEvent.CastFish,
            (data: { fish: FishModel; level: number }) => {
                const {
                    fish: { id: eid },
                    level: multiple,
                } = data;
                socket.send(ServerEvent.Hit, {
                    eid,
                    multiple,
                } as HitReq);
            },
        );

        gun_event.on(GunTrackFishEvent.StartTrack, (data: StartTrackInfo) => {
            const { fish, fire: show_point } = data;
            activeAimFish(fish, show_point, gun.pos);
        });
        gun_event.on(GunTrackFishEvent.StopTrack, () => {
            stopAim();
        });
        gun_event.on(GunEvent.WillAddBullet, (velocity: SAT.Vector) => {
            const { x, y } = velocity;
            socket.send(ServerEvent.Shoot, {
                direction: { x, y },
            } as ShootReq);
        });
        Laya.stage.on(Laya.Event.CLICK, view, (e: Laya.Event) => {
            const click_pos = getPoolMousePos();
            const _direction = new SAT.Vector(
                click_pos.x - gun_pos.x,
                click_pos.y - gun_pos.y,
            );
            gun.preAddBullet(_direction);
        });

        btn_minus.on(Laya.Event.CLICK, btn_minus, (e: Laya.Event) => {
            e.stopPropagation();
            this.sendChangeBulletCost('minus');
        });
        btn_add.on(Laya.Event.CLICK, btn_minus, (e: Laya.Event) => {
            e.stopPropagation();
            this.sendChangeBulletCost('add');
        });
    }
    private handleAutoLaunch(model: AutoLaunchModel, view: Laya.Sprite) {
        view.on(Laya.Event.CLICK, view, (e: Laya.Event) => {
            e.stopPropagation();
            console.log('auto launch');
            model.toggle();
        });
    }
    private sendChangeBulletCost(type: 'add' | 'minus') {
        const { bullet_cost } = this.model;
        const _socket = getSocket(ServerName.Game);
        _socket.send(ServerEvent.ChangeTurret, {
            multiple: changeNum(bullet_cost, 'add'),
        } as ChangeTurretReq);
    }
}
