import { Test } from 'testBuilder';

import { timer } from 'Laya';

import { tween } from '@app/utils/layaTween';
import { createTick, clearTick } from '@app/utils/tick';
import LotteryPop from '@app/view/pop/lottery';

export const laya_test = new Test('laya', (runner) => {
    const duration = 300000;
    // loop 会掉帧
    runner.describe('loop', () => {
        let i = 0;
        const start = Date.now();
        function update() {
            i += 2;
            const time = Date.now() - start;
            if (time >= duration) {
                console.log(`test:>loop:>`, i, time);
                timer.clear(laya_test, update);
            }
        }
        timer.loop(1000 / 30, laya_test, update);
    });

    // tick 不掉帧
    runner.describe('tick', () => {
        let i = 0;
        const start = Date.now();
        const tick_id = createTick((t) => {
            i += t;
            const time = Date.now() - start;
            if (time >= duration) {
                console.log(`test:>tick:>`, i, time);
                clearTick(tick_id);
            }
        });
    });
    // tick 不掉帧
    runner.describe('tween', async () => {
        const lottery = await LotteryPop.preEnter();
        await tween(5000, (radio) => {
            console.log(`tween:>`, radio);
        });
        console.log(`tween:>end`);
    });
});
