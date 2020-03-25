import { Test } from 'testBuilder';
import { injectProto } from 'honor/utils/tool';
import SkillItemView from 'view/scenes/game/skillItemView';

export const skill_item_view_test = new Test('skill_item_view', runner => {
    injectProto(SkillItemView, 'setNum', self => {
        (window as any).skill_item_view = self;
    });
});
