import { getFishById } from 'model/modelState';
import { SkillCoreCom, SkillInfo, SkillActiveInfo } from './skillCoreCom';
import { SkillModel } from './skillModel';
import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';

export type TrackFishActiveInfo = {
    user_id?: string;
    fish: string;
    /** 是否是提示 */
    is_tip?: boolean;
} & SkillActiveInfo;

export interface TrackFishInitInfo extends SkillInfo {
    lock_fish: string;
    lock_left: number;
}

/** 冰冻技能 */
export class TrackFishModel extends ComponentManager implements SkillModel {
    public skill_core: SkillCoreCom;
    private timeout: TimeoutCom;
    private init_info: TrackFishInitInfo;
    constructor(info: TrackFishInitInfo) {
        super();
        this.initCom(info);
    }
    public init() {
        const { timeout, skill_core } = this;
        const { lock_fish, lock_left } = this.init_info;
        skill_core.init();
        if (lock_fish) {
            timeout.createTimeout(() => {
                this.active({ fish: lock_fish, used_time: lock_left });
            });
        }
    }
    public reset() {
        this.skill_core.reset();
    }
    private initCom(info: TrackFishInitInfo) {
        const skill_core = new SkillCoreCom(info);
        const timeout = new TimeoutCom();
        this.addCom(skill_core, timeout);
        this.skill_core = skill_core;
        this.timeout = timeout;
        this.init_info = info;
    }
    public active(info: TrackFishActiveInfo) {
        // 激活
        const { skill_core } = this;
        const { player } = skill_core;
        const { fish, is_tip } = info;
        const fish_model = getFishById(fish);

        skill_core.active(info).then((is_complete: boolean) => {
            if (is_complete) {
                player.gun.trackFish.unTrack();
            }
        });
        skill_core.activeEvent({ is_tip });
        if (!fish_model) {
            return console.error(`cant find fish for eid=${fish}`);
        }
        player.gun.trackFish.track(fish_model, !is_tip);
    }
    public disable() {
        const { skill_core } = this;
        skill_core.disable();
    }
}
