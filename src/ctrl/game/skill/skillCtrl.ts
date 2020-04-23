import { BombModel } from 'model/game/skill/bombModel';
import { SkillEvent, SkillStatus } from 'model/game/skill/skillCoreCom';
import { SkillModel } from 'model/game/skill/skillModel';
import { Subscription } from 'rxjs';
import SkillItemView from 'view/scenes/game/skillItemView';
import {
    onTrigger,
    skillActiveHandler,
    skillDisableHandler,
    skillNormalActiveHandler,
    skillPreActiveHandler,
    getShortcut,
} from './skillCtrlUtils';
import { LockFishModel } from 'model/game/skill/lockFishModel';

export class SkillCtrl {
    private is_cur_player = false;
    private view: SkillItemView;
    private model: SkillModel;
    private bindTrigger: Subscription;
    /**
     * @param view 对应的动画
     * @param model 对应的model
     */
    constructor(model: SkillModel, view?: SkillItemView) {
        this.view = view;
        this.is_cur_player = Boolean(view);
        this.model = model;
        this.initEvent();
        this.setInfo();
    }
    private initEvent() {
        const { view, model, is_cur_player } = this;
        const { event } = model.skill_core;
        event.on(SkillEvent.ActiveSkill, (info: any) => {
            skillActiveHandler(model, info, is_cur_player);
        });

        // 非当前用户不需要绑定界面事件..
        if (!view) {
            return;
        }
        event.on(SkillEvent.StatusChange, (status: SkillStatus) => {
            if (status === SkillStatus.Active) {
                view.highlight();
            } else if (
                status === SkillStatus.Disable ||
                status === SkillStatus.Normal
            ) {
                view.unHighlight();

                view.clearCoolTime();
                skillDisableHandler(model);
            } else if (status === SkillStatus.PreActive) {
                if (
                    model instanceof BombModel ||
                    model instanceof LockFishModel
                ) {
                    view.highlight();
                }
            }
        });
        event.on(SkillEvent.UpdateInfo, () => {
            this.setInfo();
        });
        event.on(SkillEvent.UpdateRadio, (radio: number) => {
            view.showCoolTime(radio);
        });
        event.on(SkillEvent.Destroy, () => {
            this.destroy();
        });
        view.setShortcut(getShortcut(model));
        this.bindTrigger = onTrigger(model, view).subscribe(() => {
            if (model.skill_core.status === SkillStatus.Normal) {
                skillPreActiveHandler(model);
            } else if (model.skill_core.status === SkillStatus.PreActive) {
                skillNormalActiveHandler(model);
            }
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
    private destroy() {
        this.bindTrigger.unsubscribe();
    }
}
