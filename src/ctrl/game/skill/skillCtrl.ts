import SkillItemView from 'view/scenes/game/skillItemView';
import { SkillModel } from 'model/game/skill/skillModel';
import { SkillEvent, SkillStatus } from 'model/game/skill/skillCoreCom';
import {
    skillActiveHandler,
    skillDisableHandler,
    skillPreActiveHandler,
} from './skillCtrlUtils';

export class SkillCtrl {
    private view: SkillItemView;
    private model: SkillModel;
    /**
     * @param view 对应的动画
     * @param model 对应的model
     */
    constructor(model: SkillModel, view?: SkillItemView) {
        this.view = view;
        this.model = model;
        this.initEvent();
        this.setInfo();
    }
    private initEvent() {
        const { view, model } = this;
        const { event } = model.skill_core;
        event.on(SkillEvent.StatusChange, (status: SkillStatus) => {
            if (status === SkillStatus.Active) {
                view.highlight();
                // ...
            } else {
                view.unHighlight();
                skillDisableHandler(model);
            }
        });
        event.on(SkillEvent.ActiveSkill, (info: any) => {
            skillActiveHandler(model, info);
        });

        // 非当前用户不需要绑定界面事件..
        if (!view) {
            return;
        }
        event.on(SkillEvent.UpdateInfo, () => {
            this.setInfo();
        });
        event.on(SkillEvent.UpdateRadio, (radio: number) => {
            view.showCoolTime(radio);
        });
        view.on(Laya.Event.CLICK, view, (e: Laya.Event) => {
            e.stopPropagation();
            skillPreActiveHandler(model, 0);
        });
    }
    private setInfo() {
        const { view, model } = this;
        const { num, item_id } = model.skill_core;
        if (!view) {
            return;
        }
        view.setId(item_id);
        view.setNum(num);
    }
}
