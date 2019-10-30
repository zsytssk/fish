import { getFishById } from 'model/modelState';
import { SkillCoreCom, SkillInfo } from './skillCoreCom';
import { SkillModel } from './skillModel';
import { ComponentManager } from 'comMan/component';

export type TrackFishInfo = {
    /** 锁定的鱼 */
    fish: string;
    /** 是否是提示选中鱼 */
    pre_active: boolean;
} & SkillInfo;

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
        const { fish, pre_active } = info;
        const fish_model = getFishById(fish);

        player.gun.trackFish.track(fish_model, pre_active);
        skill_core.active(info).then(() => {
            player.gun.trackFish.unTrack();
        });
    }
    public disable() {
        const { skill_core } = this;
        skill_core.disable();
    }
}
