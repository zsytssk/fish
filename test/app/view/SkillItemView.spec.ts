import { injectProto } from 'honor/utils/tool';

import SkillItemView from '@app/view/scenes/game/skillItemView';

export const skill_item_view_test = {
    test: () => {
        injectProto(SkillItemView, 'setNum', (self) => {
            (window as any).skill_item_view = self;
        });
    },
};
