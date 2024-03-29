import SAT from 'sat';

import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';

import { FishEvent, FishModel } from '@app/model/game/fish/fishModel';
import { getAimFish, getFishById, detectInScreen } from '@app/model/modelState';
import { log, error } from '@app/utils/log';

import { BulletGroup, BulletGroupEvent } from '../gun/bulletGroup';
import { AddBulletInfo, GunEvent, GunModel, GunStatus } from '../gun/gunModel';
import {
    SkillActiveInfo,
    SkillCoreCom,
    SkillInfo,
    SkillStatus,
} from './skillCoreCom';
import { SkillModel } from './skillModel';

export type LockFishActiveInfo = {
    user_id?: string;
    fish: string;
    duration?: number;
    /** 是否激活 */
    needActive: boolean;
} & SkillActiveInfo;

export interface LockFishInitInfo extends SkillInfo {
    lock_fish: string;
    lock_left: number;
}

export type StartLockInfo = {
    fish: FishModel;
    fire: boolean;
};
export const GunLockFishEvent = {
    /** 开始追踪 */
    StartLock: 'start_lock',
    /** 停止追踪 */
    StopLock: 'stop_lock',
};

export type LockActiveData = {
    is_tip?: boolean;
    fish: FishModel;
    gun_pos: Point;
};

/** 冰冻技能 */
export class LockFishModel extends ComponentManager implements SkillModel {
    public skill_core: SkillCoreCom;
    private timeout: TimeoutCom;
    private init_info: LockFishInitInfo;
    public fish: FishModel;
    public bullet_list: Map<string, BulletGroup> = new Map();
    private gun: GunModel;
    constructor(info: LockFishInitInfo) {
        super();
        this.initCom(info);
    }
    public init() {
        const { timeout, skill_core } = this;
        const { lock_fish, lock_left, ...other } = this.init_info;

        if (lock_left) {
            timeout.createTimeout(() => {
                this.active({
                    ...other,
                    fish: lock_fish,
                    duration: lock_left + other.used_time,
                    needActive: true,
                });
            });
        } else {
            skill_core.init();
        }
        this.gun = this.skill_core.player.gun;
    }
    public reset() {
        this.skill_core.reset();
    }
    private initCom(info: LockFishInitInfo) {
        const skill_core = new SkillCoreCom(info);
        const timeout = new TimeoutCom();
        this.addCom(skill_core, timeout);
        this.skill_core = skill_core;
        this.timeout = timeout;
        this.init_info = info;
    }
    public active(info: LockFishActiveInfo) {
        // 激活
        const { skill_core } = this;
        const { fish, needActive } = info;
        const { status } = skill_core;

        if (status !== SkillStatus.Active && !needActive) {
            return;
        }

        if (needActive) {
            skill_core.active(info, (_status) => {
                if (_status === SkillStatus.Disable) {
                    this.unLock();
                }
            });
        }

        const fish_model = getFishById(fish);
        if (!fish_model) {
            return error(`cant find fish for eid=${fish}`);
        }
        this.lock(fish_model);
    }
    public tipLock() {
        const { gun, skill_core } = this;
        const fish = getAimFish();

        skill_core.activeEvent({
            fish,
            is_tip: true,
            gun_pos: gun.pos,
        } as LockActiveData);
    }
    /**
     * 追踪的鱼
     * @param fish 追踪的鱼
     * @param is_tip 是否是提示
     */
    private lock(fish: FishModel) {
        const { gun, skill_core } = this;
        this.unLock();
        this.bindLockFish(fish);
        skill_core.activeEvent({
            fish,
            is_tip: false,
            gun_pos: gun.pos,
        } as LockActiveData);
    }
    /** 监听锁定鱼事件 */
    private bindLockFish(fish: FishModel) {
        const { gun, skill_core } = this;
        const { event: gun_event } = gun;
        const { event: fish_event } = fish;

        this.fish = fish;
        gun.lock_fish = fish;
        this.onLockMove();
        fish_event.on(FishEvent.Move, this.onLockMove, this);
        fish_event.on(
            FishEvent.Destroy,
            () => {
                this.unLock();
                setTimeout(() => {
                    this.tipLock();
                });
            },
            this,
        );
        gun.setStatus(GunStatus.LockFish);

        gun.preAddBullet(gun.direction, true);
        gun_event.on(
            GunEvent.SwitchOn,
            () => {
                gun.preAddBullet(gun.direction, true);
            },
            this,
        );

        /** 收集 lock fish 的子弹 在鱼销毁的时候需要还原
         */
        let i = 0;
        gun_event.on(
            GunEvent.AddBullet,
            (info: AddBulletInfo) => {
                if (info.lock) {
                    const { bullet_group } = info;
                    const localId = i + '';
                    i++;
                    this.bullet_list.set(localId, bullet_group);
                    /** 子弹销毁的时候需要冲列表中销毁... */
                    bullet_group.event.on(
                        BulletGroupEvent.Destroy,
                        () => {
                            this.bullet_list.delete(localId);
                        },
                        this,
                    );
                }
            },
            this,
        );
    }

    /** 监听 lock 目标位置改变 */
    private onLockMove = () => {
        const { gun, fish, skill_core } = this;
        if (!fish?.visible) {
            return;
        }
        const { x, y } = fish.pos;
        const { x: gx, y: gy } = gun.pos;
        gun.setDirection(new SAT.Vector(x - gx, y - gy));
        if (skill_core.player.need_emit) {
            if (!detectInScreen(fish.pos)) {
                this.unLock();
                this.tipLock();
            }
        }
    }; // tslint:disable-line: semicolon
    /** 检查鱼是否在视界中 */
    public unLock = () => {
        const { fish, gun, bullet_list } = this;
        if (!fish || !gun) {
            return;
        }

        const { player } = gun;
        let bullets_cost = 0;
        for (const [, bullet] of bullet_list) {
            const { bullet_cost } = bullet;
            bullets_cost += bullet_cost;
            gun.removeBullet(bullet);
            bullet.destroy();
        }
        player.updateInfo({
            bullet_num: player.bullet_num + bullets_cost,
        });
        bullet_list.clear();

        gun.event.emit(GunLockFishEvent.StopLock);
        gun.setStatus(GunStatus.Normal);
        gun.lock_fish = undefined;
        gun.event.offAllCaller(this);
        fish.event.offAllCaller(this);
        this.fish = null;
    }; // tslint:disable-line: semicolon
    public disable() {
        const { skill_core } = this;
        skill_core.disable();
    }
    public destroy() {
        const { fish } = this;
        fish?.event?.offAllCaller(this);
        this.unLock();

        this.fish = undefined;
        this.skill_core = undefined;
        this.gun = undefined;

        super.destroy();
    }
}
