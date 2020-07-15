import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { errorHandler } from 'ctrl/hall/commonSocket';
import { AudioRes } from 'data/audioRes';
import { ServerErrCode, ServerEvent } from 'data/serverEvent';
import { Laya } from 'Laya';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Sprite } from 'laya/display/Sprite';
import { Event } from 'laya/events/Event';
import { FishModel } from 'model/game/fish/fishModel';
import { AddBulletInfo, GunEvent, LevelInfo } from 'model/game/gun/gunModel';
import { CaptureInfo, PlayerEvent, PlayerModel } from 'model/game/playerModel';
import { AutoShootModel } from 'model/game/skill/autoShootModel';
import { getUserInfo, getCurPlayer } from 'model/modelState';
import SAT from 'sat';
import { log } from 'utils/log';
import { darkNode, unDarkNode } from 'utils/utils';
import { showAwardCircle } from 'view/scenes/game/ani_wrap/award/awardBig';
import { showAwardCoin } from 'view/scenes/game/ani_wrap/award/awardCoin';
import { awardSkill } from 'view/scenes/game/ani_wrap/award/awardSkill';
import GunBoxView from 'view/scenes/game/gunBoxView';
import {
    getAutoShootSkillItem,
    getGameView,
    getPoolMousePos,
    getSkillItemByIndex,
    setAutoShootLight,
    setBulletNum,
} from 'view/viewState';
import { BulletCtrl } from './bulletCtrl';
import { GameCtrl } from './gameCtrl';
import { sendToGameSocket } from './gameSocket';
import { SkillCtrl } from './skill/skillCtrl';
import { getItem, setItem } from 'utils/localStorage';

// prettier-ignore
const bullet_cost_arr  =
         [1, 2, 3, 4, 5, 10, 15, 20];
/** 玩家的控制器 */
export class PlayerCtrl {
    /**
     * @param view 玩家对应的动画
     * @param model 玩家对应的model
     */
    constructor(
        public view: GunBoxView,
        public model: PlayerModel,
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
                user_id,
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
                        const { cur_balance } = getUserInfo();
                        awardSkill(pos, end_pos, drop, cur_balance);
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
            this,
        );
        player_event.on(
            PlayerEvent.Destroy,
            () => {
                this.destroy();
            },
            this,
        );
        gun_event.on(
            GunEvent.AddBullet,
            (info: AddBulletInfo) => {
                const { bullet_group, velocity } = info;
                const { rage } = gun;
                view.fire(velocity, user_id);
                if (is_cur_player) {
                    view.stopPosTip();
                }
                for (const bullet of bullet_group.bullet_list) {
                    const bullet_view = view.addBullet(
                        bullet.skin,
                        rage,
                    ) as Skeleton;
                    const bullet_ctrl = new BulletCtrl(bullet_view, bullet);
                }
            },
            this,
        );

        view.setDirection(direction);
        gun_event.on(
            GunEvent.DirectionChange,
            (_direction: SAT.Vector) => {
                view.setDirection(_direction);
            },
            this,
        );
        gun_event.on(
            GunEvent.LevelChange,
            (level_info: LevelInfo) => {
                if (is_cur_player) {
                    this.detectDisableChangeBulletCost(level_info.bullet_cost);
                }
                view.setBulletCost(level_info);
            },
            this,
        );
        view.on(Event.CLICK, view, (e: Event) => {
            e.stopPropagation();
        });

        let index = 0;
        for (const [, skill_model] of skill_map) {
            if (skill_model instanceof AutoShootModel) {
                if (is_cur_player) {
                    const auto_shoot_view = getAutoShootSkillItem();
                    this.handleAutoShoot(skill_model, auto_shoot_view);
                }
                continue;
            } else {
                if (is_cur_player) {
                    const skill_view = getSkillItemByIndex(index);
                    new SkillCtrl(skill_model, this, skill_view); // tslint:disable-line
                } else {
                    new SkillCtrl(skill_model, this); // tslint:disable-line
                }
            }
            index++;
        }

        gun_event.on(
            GunEvent.WillAddBullet,
            (velocity: SAT.Vector) => {
                const {
                    need_emit,
                    user_id,
                    is_cur_player: is_cur,
                } = this.model;
                if (!need_emit) {
                    return;
                }
                const { x, y } = velocity;
                AudioCtrl.play(AudioRes.Fire, is_cur ? 1 : 0.3);
                const data = {
                    direction: { x, y },
                    userId: user_id,
                } as ShootReq;

                if (!is_cur) {
                    data.robotId = user_id;
                    data.userId = getCurPlayer().user_id;
                }
                sendToGameSocket(ServerEvent.Shoot, data);
            },
            this,
        );

        gun_event.on(
            GunEvent.CastFish,
            (data: { fish: FishModel; level: number }) => {
                const {
                    fish: { id: eid },
                    level: multiple,
                } = data;
                const { user_id, is_cur_player: is_cur } = this.model;

                const _data: HitReq = {
                    eid,
                    multiple,
                };
                if (!is_cur) {
                    _data.robotId = user_id;
                }

                sendToGameSocket(ServerEvent.Hit, _data);
            },
            this,
        );
        /** 当前用户的处理 */
        if (!is_cur_player) {
            return;
        }
        view.setMySelfStyle();
        this.resetGetBulletCost();

        player_event.on(
            PlayerEvent.UpdateInfo,
            () => {
                const { bullet_num } = this.model;
                setBulletNum(bullet_num);
            },
            this,
        );
        gun_event.on(
            GunEvent.NotEnoughBulletNum,
            () => {
                if (this.game_ctrl.isTrial) {
                    errorHandler(ServerErrCode.TrialNotBullet);
                } else {
                    errorHandler(ServerErrCode.ReExchange);
                }
            },
            this,
        );
        gun_event.on(
            GunEvent.AutoShoot,
            (is_active: boolean) => {
                setAutoShootLight(is_active);
            },
            this,
        );

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
    private handleAutoShoot(model: AutoShootModel, view: Sprite) {
        view.on(Event.CLICK, view, (e: Event) => {
            e.stopPropagation();
            log('auto shoot');
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
    private resetGetBulletCost() {
        /** 将炮台倍数保存到本地, 等下次登陆在重新设置 */
        const { isTrial } = this.game_ctrl;
        const { cur_balance, user_id } = getUserInfo();
        const bullet_cost = getItem(`${user_id}:${cur_balance}:${isTrial}`);
        if (bullet_cost) {
            sendToGameSocket(ServerEvent.ChangeTurret, {
                multiple: Number(bullet_cost),
            } as ChangeTurretReq);
        }
    }
    private sendChangeBulletCost(type: 'add' | 'minus') {
        const { isTrial } = this.game_ctrl;
        const { bullet_cost } = this.model;

        const index = bullet_cost_arr.indexOf(bullet_cost);
        const next_index = type === 'add' ? index + 1 : index - 1;

        if (next_index < 0 || next_index > bullet_cost_arr.length - 1) {
            return;
        }

        AudioCtrl.play(AudioRes.Click);
        const next = bullet_cost_arr[next_index];
        this.detectDisableChangeBulletCost(next);
        sendToGameSocket(ServerEvent.ChangeTurret, {
            multiple: next,
        } as ChangeTurretReq);

        /** 将炮台倍数保存到本地, 等下次登陆在重新设置 */
        const { cur_balance, user_id } = getUserInfo();
        setItem(`${user_id}:${cur_balance}:${isTrial}`, next + '');
    }
    public destroy() {
        const {
            view,
            model: {
                gun: { event: gun_event },
                event: player_event,
            },
        } = this;

        getGameView().offAllCaller(view);
        Laya.stage.offAllCaller(view);
        player_event.offAllCaller(this);
        gun_event.offAllCaller(this);

        view.destroy();
        this.view = undefined;
        this.game_ctrl = undefined;
        this.model = undefined;
    }
}
