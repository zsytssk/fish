import { Test } from 'testBuilder';

import { injectAfter } from 'honor/utils/tool';

import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { modelState } from '@app/model/modelState';

export const hall_test = {
    enter: () => {
        HallCtrl.preEnter().then(() => {
            console.log(`enter:>`, 1);
        });
    },
    userInfo: () => {
        const { setting, user_info } = modelState.app;
        user_info.setNickname('zsytssk@gmail.com');
    },
};

export async function afterHallEnter() {
    if (HallCtrl.instance) {
        return true;
    }

    await injectAfter(HallCtrl, 'preEnter');
}
