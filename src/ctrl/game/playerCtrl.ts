import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { AudioRes } from 'data/audioRes';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { FishModel } from 'model/game/fish/fishModel';
import { AddBulletInfo, GunEvent, LevelInfo } from 'model/game/gun/gunModel';
import { CaptureInfo, PlayerEvent, PlayerModel } from 'model/game/playerModel';
import { AutoLaunchModel } from 'model/game/skill/autoLaunchModel';
import SAT from 'sat';
import { darkNode, unDarkNode } from 'utils/utils';
import AlertPop from 'view/pop/alert';
import ShopPop from 'view/pop/shop';
import { showAwardCoin } from 'view/scenes/game/ani_wrap/award/awardCoin';
import { awardSkill } from 'view/scenes/game/ani_wrap/award/awardSkill';
import GunBoxView from 'view/scenes/game/gunBoxView';
import {
    getAutoLaunchSkillItem,
    getGameView,
    getPoolMousePos,
    getSkillItemByIndex,
    setBulletNum,
} from 'view/viewState';
import { BulletCtrl } from './bulletCtrl';
import { SkillCtrl } from './skill/skillCtrl';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Event } from 'laya/events/Event';
import { Laya } from 'Laya';
import { Sprite } from 'laya/display/Sprite';
import { log } from 'utils/log';
import { GameCtrl } from './gameCtrl';
import { showAwardCircle } from 'view/scenes/game/ani_wrap/award/awardBig';

// prettier-ignore
const bullet_cost_arr  =
         [1, 2, 3, 4, 5, 10, 15, 20, 30, 50, 80, 100, 200, 300, 500, 800, 1000];
/** 玩家的控制器 */
export class PlayerCtrl {
    /**
     * @param view 玩家对应的动画
     * @param model 玩家对应的model
     */
    constructor(
        private view: GunBoxView,
        private model: PlayerModel,
        private game_ctrl: GameCtrl,
    ) {
        this.init();
    }
    private init() {
        this.initGun();
        this.initEvent();
    }
    private initGun() {
        const { view, model, game_ctrl } = this;
        const { server_index, gun, bullet_num, is_cur_player } = model;
        const { pos } = gun;
        if (server_index >= 2) {
            view.fixServerTopPos();
        }
        const client_index = game_ctrl.calcClientIndex(server_index);
        if (client_index >= 2) {
            view.fixClientTopPos();
        }
        view.setPos(pos.x, pos.y);
        if (is_cur_player) {
            setBulletNum(bullet_num);
        }
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
        const { btn_minus, btn_add } = view;

        player_event.on(
            PlayerEvent.CaptureFish,
            (capture_info: CaptureInfo) => {
                const {
                    pos,
                    data: { win, drop },
                    resolve,
                } = capture_info;
                const { pos: end_pos } = gun;
                if (!pos) {
                    resolve();
                }
                if (is_cur_player) {
                    /** 飞行技能 */
                    if (drop) {
                        awardSkill(pos, end_pos, drop);
                    }
                    AudioCtrl.play(AudioRes.FlySkill);
                }

                if (!win) {
                    resolve();
                } else if (is_cur_player && win > 1000) {
                    /** 奖励圆环 */
                    showAwardCircle(pos, win, is_cur_player).then(resolve);
                } else {
                    /** 奖励金币动画 */
                    showAwardCoin(pos, end_pos, win, is_cur_player).then(
                        resolve,
                    );
                }
            },
        );
        player_event.on(PlayerEvent.Destroy, () => {
            this.destroy();
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
                ) as Skeleton;
                const bullet_ctrl = new BulletCtrl(bullet_view, bullet);
            }
        });

        view.setDirection(direction);
        gun_event.on(GunEvent.DirectionChange, (_direction: SAT.Vector) => {
            view.setDirection(_direction);
        });
        gun_event.on(GunEvent.LevelChange, (level_info: LevelInfo) => {
            if (is_cur_player) {
                AudioCtrl.play(AudioRes.ChangeSkin);
            }
            if (is_cur_player) {
                this.detectDisableChangeBulletCost(level_info.bullet_cost);
            }
            view.setBulletCost(level_info);
        });
        view.on(Event.CLICK, view, (e: Event) => {
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
                    new SkillCtrl(skill_model, skill_view); // tslint:disable-line
                } else {
                    new SkillCtrl(skill_model); // tslint:disable-line
                }
            }
            index++;
        }

        /** 当前用户的处理 */
        if (!is_cur_player) {
            return;
        }
        view.setMySelfStyle();
        const socket = getSocket('game');

        player_event.on(PlayerEvent.UpdateInfo, () => {
            const { bullet_num } = this.model;
            setBulletNum(bullet_num);
        });
        gun_event.on(GunEvent.NotEnoughBulletNum, () => {
            AlertPop.alert('子弹数目不够, 是否购买?').then(type => {
                if (type === 'confirm') {
                    ShopPop.preEnter();
                }
            });
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
        gun_event.on(GunEvent.WillAddBullet, (velocity: SAT.Vector) => {
            const { x, y } = velocity;
            AudioCtrl.play(AudioRes.Fire);
            socket.send(ServerEvent.Shoot, {
                direction: { x, y },
            } as ShootReq);
        });

        getGameView().on(Event.CLICK, view, (e: Event) => {
            const click_pos = getPoolMousePos();
            const _direction = new SAT.Vector(
                click_pos.x - gun_pos.x,
                click_pos.y - gun_pos.y,
            );
            gun.preAddBullet(_direction);
        });
        btn_minus.on(Event.CLICK, btn_minus, (e: Event) => {
            e.stopPropagation();
            this.sendChangeBulletCost('minus');
        });
        btn_add.on(Event.CLICK, btn_add, (e: Event) => {
            e.stopPropagation();
            this.sendChangeBulletCost('add');
        });
    }
    private handleAutoLaunch(model: AutoLaunchModel, view: Sprite) {
        view.on(Event.CLICK, view, (e: Event) => {
            e.stopPropagation();
            log('auto launch');
            model.toggle();
        });
    }
    private detectDisableChangeBulletCost(cost: number) {
        const { btn_minus, btn_add } = this.view;
        const index = bullet_cost_arr.indexOf(cost);

        unDarkNode(btn_minus);
        unDarkNode(btn_add);
        if (index <= 0) {
            darkNode(btn_minus);
        } else if (index >= bullet_cost_arr.length - 1) {
            darkNode(btn_add);
        }
    }
    private sendChangeBulletCost(type: 'add' | 'minus') {
        const { bullet_cost } = this.model;

        const index = bullet_cost_arr.indexOf(bullet_cost);
        const next_index = type === 'add' ? index + 1 : index - 1;

        if (next_index < 0 || next_index > bullet_cost_arr.length - 1) {
            return;
        }

        AudioCtrl.play(AudioRes.Fire);
        const next = bullet_cost_arr[next_index];
        this.detectDisableChangeBulletCost(next);
        const _socket = getSocket(ServerName.Game);
        _socket.send(ServerEvent.ChangeTurret, {
            multiple: next,
        } as ChangeTurretReq);
    }
    public destroy() {
        const { view } = this;
        view.destroy();
        Laya.stage.offAllCaller(this.view);
        this.view = undefined;
    }
}
