import { getFishById } from 'model/modelState';
import { SkillCoreCom, SkillInfo, SkillActiveInfo } from './skillCoreCom';
import { SkillModel } from './skillModel';
import { ComponentManager } from 'comMan/component';

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
    constructor(info: TrackFishInitInfo) {
        super();
        this.init(info);
    }
    public get skill_core() {
        return this.getCom(SkillCoreCom);
    }
    private init(info: TrackFishInitInfo) {
        this.addCom(new SkillCoreCom(info));
        const { lock_fish, lock_left } = info;
        if (lock_fish) {
            setTimeout(() => {
                this.active({ fish: lock_fish, used_time: lock_left });
            });
        }
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
