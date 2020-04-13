import { Test } from 'testBuilder';
import { startCount, clearCount } from 'utils/count';

export const count_test = new Test('count', runner => {
    let i = 0;
    runner.describe('count', (time: number, delta: number) => {
        i++;
        time = time || 10;
        delta = delta || 0.01;

        console.time('startCount' + i);
        const count = startCount(time, delta, t => {
            if (t === 0) {
                console.timeEnd('startCount' + i);
                return;
            }
            console.log(t, Math.floor(11 * t));
        });
    });
});
