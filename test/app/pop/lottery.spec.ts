import { Test } from 'testBuilder';
import honor from 'honor';
import Data from './lottery.json';
import LotteryPop from 'view/pop/lottery';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent } from 'data/serverEvent';
import { sleep } from 'utils/animate';

export const lottery_test = new Test('lottery', runner => {
    runner.describe('open', () => {
        LotteryPop.preEnter();
    });

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
                pop.runLotteryAni(Data.lottery[2].lottery_id);
            }, 3000);
        }) as Promise<void>;
    });
});
