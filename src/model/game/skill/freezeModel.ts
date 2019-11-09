import { modelState } from 'model/modelState';
import { SkillCoreCom, SkillInfo, SkillActiveInfo } from './skillCoreCom';
import { SkillModel } from './skillModel';
import { ComponentManager } from 'comMan/component';

export type FreezeInfo = {
    user_id: string;
    fish_list: string[];
} & SkillActiveInfo;
/** 冰冻技能 */
export class FreezeModel extends ComponentManager implements SkillModel {
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
    public active(info: FreezeInfo) {
        const { skill_core } = this;
        const { cool_time } = skill_core;
        const { used_time, fish_list } = info;
        const { game } = modelState.app;
        game.freezing_com.freezing(cool_time - used_time, fish_list);
        skill_core.active(info);
    }
    public disable() {
        const { skill_core } = this;
        skill_core.disable();
    }
}
