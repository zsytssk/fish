import SkillItemView from 'view/scenes/game/skillItemView';
import { SkillModel } from 'model/skill/skillModel';
import { SkillEvent, SkillStatus } from 'model/skill/skillCoreCom';
import {
    skillActiveHandler,
    skillDisableHandler,
    skillPreActiveHandler,
} from './skillCtrlUtils';

export class SkillCtrl {
    /**
     * @param view 对应的动画
     * @param model 对应的model
     */
    constructor(private view: SkillItemView, private model: SkillModel) {
        this.initEvent();
        this.setInfo();
    }
    private initEvent() {
        const { view, model } = this;
        const { event } = model.skill_core;
        event.on(SkillEvent.UpdateInfo, () => {
            this.setInfo();
        });
        event.on(SkillEvent.UpdateRadio, (radio: number) => {
            view.showCoolTime(radio);
        });
        event.on(SkillEvent.StatusChange, (status: SkillStatus) => {
            if (status === SkillStatus.Active) {
                skillActiveHandler(model);
            } else {
                skillDisableHandler(model);
            }
        });
        view.on(Laya.Event.CLICK, view, (e: Laya.Event) => {
            // @test
            e.stopPropagation();
            skillPreActiveHandler(model);
        });
    }
    private setInfo() {
        const { view, model } = this;
        const { num, item_id } = model.skill_core;
        view.setId(item_id);
        view.setNum(num);
    }
}
