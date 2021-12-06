import { Test } from 'testBuilder';

import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { modelState } from '@app/model/modelState';

export const hall_test = {
    enter: () => {
        HallCtrl.preEnter().then(() => {
            console.log(`enter:>`, 1);
        });

        setTimeout(() => {
            HallCtrl.preEnter().then(() => {
                console.log(`enter:>`, 2);
            });
        }, 100);
    },
    userInfo: () => {
        const { setting, user_info } = modelState.app;
        user_info.setNickname('zsytssk@gmail.com');
    },
};
