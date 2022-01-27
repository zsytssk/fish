import { Test } from 'testBuilder';

import { setItem, getItem } from '@app/utils/localStorage';
import { vectorToDegree } from '@app/utils/mathUtils';

export const utils_test = new Test('utils', (runner) => {
    runner.describe(
        'vector_to_degree',
        (...params: Parameters<typeof vectorToDegree>) => {
            vectorToDegree(...params);
        },
    );
    runner.describe('local_storage', () => {
        const time_day = 10 / (24 * 60 * 60);
        const time_stamp = time_day * (24 * 60 * 60 * 1000);
        setItem('test', 'hello world!', time_day);

        console.log(getItem('test1'));
        setTimeout(() => {
            console.log(getItem('test'));
        }, time_stamp - 100);
    });

    // console.log(changeNum(9, 'add'));
    // console.log(splitNum(9));
    // console.log(addZeroToNum(9, 2));
});
