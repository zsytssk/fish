import { Subscription } from 'rxjs';

import { BombModel } from '@app/model/game/skill/bombModel';
import { LockFishModel } from '@app/model/game/skill/lockFishModel';
import { SkillEvent, SkillStatus } from '@app/model/game/skill/skillCoreCom';
import { SkillModel } from '@app/model/game/skill/skillModel';
import SkillItemView from '@app/view/scenes/game/skillItemView';

import { PlayerCtrl } from '../playerCtrl';
import {
    onTrigger,
    skillActiveHandler,
    skillDisableHandler,
    skillNormalActiveHandler,
    skillPreActiveHandler,
} from './skillCtrlUtils';

export class SkillCtrl {
    private view: SkillItemView;
    private model: SkillModel;
    private player: PlayerCtrl;
    private bindTrigger: Subscription;
    /**
     * @param view 对应的动画
     * @param model 对应的model
     */
    constructor(model: SkillModel, player: PlayerCtrl, view?: SkillItemView) {
        this.view = view;
        this.model = model;
        this.player = player;
        this.initEvent();
        this.setInfo();
    }
    private initEvent() {
        const { view, model, player } = this;
        const { event } = model.skill_core;
        event.on(
            SkillEvent.ActiveSkill,
            (info: any) => {
                skillActiveHandler(model, info, player.model);
            },
            this,
        );

        // 非当前用户不需要绑定界面事件..
        if (!view) {
            return;
        }
        event.on(
            SkillEvent.StatusChange,
            (status: SkillStatus) => {
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
            },
            this,
        );
        event.on(
            SkillEvent.UpdateInfo,
            () => {
                this.setInfo();
            },
            this,
        );

        let i = 0;
        event.on(
            SkillEvent.UpdateRadio,
            (radio: number) => {
                if (i % 3 && radio !== 1) {
                    i++;
                    return;
                }
                i++;
                if (radio === 1) {
                    i = 0;
                }
                view.showCoolTime(radio);
            },
            this,
        );
        event.on(
            SkillEvent.Destroy,
            () => {
                this.destroy();
            },
            this,
        );
        // view.setShortcut(getShortcut(model));
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
        this.model?.skill_core?.event?.offAllCaller(this);
        this.bindTrigger.unsubscribe();

        this.model = undefined;
    }
}
