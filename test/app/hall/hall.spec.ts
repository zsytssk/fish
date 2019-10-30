import { Test } from 'testBuilder';
import { modelState } from 'model/modelState';

export const hall_test = new Test('hall', runner => {
    runner.describe('user_info', () => {
        const { setting, user_info } = modelState.app;
        user_info.setNickname('zsytssk@gmail.com');
        user_info.setAccount({
            BTC: 123123,
            ETC: 123123,
            ETH: 123123,
        });
        setting.setCurCoin('BTC');
    });
});
