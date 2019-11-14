import { Test } from 'testBuilder';
import { modelState } from 'model/modelState';

export const hall_test = new Test('hall', runner => {
    runner.describe('user_info', () => {
        const { setting, user_info } = modelState.app;
        user_info.setNickname('zsytssk@gmail.com');
    });
});
