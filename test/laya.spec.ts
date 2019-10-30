import { Test } from 'testBuilder';
import { createTick, clearTick } from 'utils/tick';

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
                Laya.timer.clear(Laya, update);
            }
        }
        Laya.timer.loop(1000 / 30, Laya, update);
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
});
