import { Test } from 'testBuilder';
import honor from 'honor';
import Data from './lottery.json';
import LotteryPop from 'view/pop/lottery';

export const lottery_test = new Test('lottery', runner => {
    runner.describe('render_data', () => {
        return new Promise(async resolve => {
            const pop = (await honor.director.openDialog(
                LotteryPop,
            )) as LotteryPop;
            setTimeout(() => {
                pop.initData(Data);
                resolve();
            }, 1000);

            setTimeout(() => {
                pop.runLottery(Data.lottery[2].id);
            }, 3000);
        }) as Promise<void>;
    });
});
