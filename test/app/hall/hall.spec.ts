import { Test } from 'testBuilder';
import { modelState } from 'model/modelState';
import { HallCtrl } from 'ctrl/hall/hallCtrl';

export const hall_test = new Test('hall', runner => {
    runner.describe('enter', () => {
        HallCtrl.preEnter().then(() => {
            console.log(`enter:>`, 1);
        });

        setTimeout(() => {
            HallCtrl.preEnter().then(() => {
                console.log(`enter:>`, 2);
            });
        }, 100);
    });
    runner.describe('user_info', () => {
        const { setting, user_info } = modelState.app;
        user_info.setNickname('zsytssk@gmail.com');
    });
});
