import { getFishById } from 'model/modelState';
import { SkillCoreCom, SkillInfo, SkillActiveInfo } from './skillCoreCom';
import { SkillModel } from './skillModel';
import { ComponentManager } from 'comMan/component';

export type TrackFishInfo = {
    user_id: string;
    fish: string;
    /** 是否是提示 */
    is_tip?: boolean;
} & SkillActiveInfo;

/** 冰冻技能 */
export class TrackFishModel extends ComponentManager implements SkillModel {
    constructor(info: SkillInfo) {
        super();
        this.init(info);
    }
    public get skill_core() {
        return this.getCom(SkillCoreCom);
    }
    private init(info: SkillInfo) {
        this.addCom(new SkillCoreCom(info));
    }
    public active(info: TrackFishInfo) {
        // 激活
        const { skill_core } = this;
        const { player } = skill_core;
        const { fish, is_tip } = info;
        const fish_model = getFishById(fish);
        if (!fish_model) {
            return console.error(`cant find fish for eid=${fish}`);
        }

        player.gun.trackFish.track(fish_model, !is_tip);
        if (is_tip) {
            skill_core.activeEvent({ is_tip: true });
        }
        skill_core.active(info).then(() => {
            player.gun.trackFish.unTrack();
        });
    }
    public disable() {
        const { skill_core } = this;
        skill_core.disable();
    }
}
