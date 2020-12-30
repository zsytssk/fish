import { Test } from 'testBuilder';
import { createTick, clearTick } from 'utils/tick';
import { tween } from 'utils/layaTween';
import LotteryPop from 'view/pop/lottery';
import { timer } from 'Laya';

export const laya_test = new Test('laya', runner => {
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
        const tick_id = createTick(t => {
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
        await tween(5000, radio => {
            console.log(`tween:>`, radio);
        });
        console.log(`tween:>end`);
    });
});
