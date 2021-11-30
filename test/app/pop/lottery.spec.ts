import { Test } from 'testBuilder';

import honor from 'honor';

import { sleep } from '@app/utils/animate';
import { tween } from '@app/utils/layaTween';
import LotteryPop from '@app/view/pop/lottery';

import Data from './lottery.json';

export const lottery_test = new Test('lottery', (runner) => {
    runner.describe('open', () => {
        LotteryPop.preEnter();
    });

    runner.describe('render_data', () => {
        return new Promise(async (resolve) => {
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

    runner.describe('tween', async () => {
        const pop = (await honor.director.openDialog(LotteryPop)) as LotteryPop;

        await sleep(1);
        pop.initData(Data);

        // await sleep(2);
        const num = 21;
        let end = false;
        await tween(5000, (radio) => {
            const cur_index = Math.round(radio * num);
            const cur_round_index = cur_index % 5;
            if (end) {
                return;
            }
            if (cur_index === num) {
                end = true;
            }
            // pop.testAni(cur_round_index, cur_index === num);
        });
        console.log(`tween:>end`);
    });
});
