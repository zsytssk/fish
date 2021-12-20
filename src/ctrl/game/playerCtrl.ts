import SAT from 'sat';

import { Laya } from 'Laya';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Sprite } from 'laya/display/Sprite';
import { Event } from 'laya/events/Event';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { errorHandler } from '@app/ctrl/hall/commonSocket';
import { AudioRes } from '@app/data/audioRes';
import { ServerErrCode, ServerEvent, ServerName } from '@app/data/serverEvent';
import { FishModel } from '@app/model/game/fish/fishModel';
import {
    AddBulletInfo,
    GunEvent,
    LevelInfo,
} from '@app/model/game/gun/gunModel';
import {
    CaptureInfo,
    PlayerEvent,
    PlayerModel,
} from '@app/model/game/playerModel';
import { AutoShootModel } from '@app/model/game/skill/autoShootModel';
import {
    getCurPlayer,
    getGameCurrency,
    getUserInfo,
} from '@app/model/modelState';
import { getItem, setItem } from '@app/utils/localStorage';
import { log } from '@app/utils/log';
import { darkNode, unDarkNode } from '@app/utils/utils';
import { showAwardCircle } from '@app/view/scenes/game/ani_wrap/award/awardBig';
import { showAwardCoin } from '@app/view/scenes/game/ani_wrap/award/awardCoin';
import { awardSkill } from '@app/view/scenes/game/ani_wrap/award/awardSkill';
import GunBoxView from '@app/view/scenes/game/gunBoxView';
import {
    getAutoShootSkillItem,
    getGameView,
    getPoolMousePos,
    getSkillItemByIndex,
    setAutoShootLight,
    setBulletNum,
} from '@app/view/viewState';

import { getSocket } from '../net/webSocketWrapUtil';
import { BulletCtrl } from './bulletCtrl';
import { GameCtrlUtils } from './gameCtrl';
import { SkillCtrl } from './skill/skillCtrl';

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
        public game_ctrl: GameCtrlUtils,
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
        if (game_ctrl.needUpSideDown(server_index)) {
            view.fixServerTopPos();
        }
        const client_index = game_ctrl.calcClientIndex(server_index);
        if (game_ctrl.needUpSideDown(client_index)) {
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
                        const cur_balance = getGameCurrency();
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
                    AudioCtrl.play(AudioRes.Fire);
                }

                for (const [, bullet] of bullet_group.bullet_map) {
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
                if (!this.model) {
                    return;
                }
                const { need_emit, user_id, is_cur_player } = this.model;
                if (!need_emit) {
                    return;
                }
                const { x, y } = velocity;
                const data = {
                    direction: { x, y },
                    userId: user_id,
                } as ShootReq;

                if (!is_cur_player) {
                    data.robotId = user_id;
                    data.userId = getCurPlayer().user_id;
                }
                this.game_ctrl.sendToGameSocket(ServerEvent.Shoot, data);
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

                this.game_ctrl.sendToGameSocket(ServerEvent.Hit, _data);
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
                const socket = this.game_ctrl.getSocket();
                if (this.game_ctrl.isTrial) {
                    errorHandler(ServerErrCode.TrialNotBullet, null, socket);
                } else {
                    errorHandler(ServerErrCode.ReExchange, null, socket);
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
        const { user_id } = getUserInfo();
        const cur_balance = getGameCurrency();
        const bullet_cost = getItem(`${user_id}:${cur_balance}:${isTrial}`);
        if (bullet_cost) {
            this.game_ctrl.sendToGameSocket(ServerEvent.ChangeTurret, {
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
        this.game_ctrl.sendToGameSocket(ServerEvent.ChangeTurret, {
            multiple: next,
        } as ChangeTurretReq);

        /** 将炮台倍数保存到本地, 等下次登陆在重新设置 */
        const { user_id } = getUserInfo();
        const cur_balance = getGameCurrency();
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
