import * as path from 'path';
import { write } from '../../zutil/ls/write';
import shoal_data from './data/shoal1.source.json';
import { stringify } from '../../zutil/utils/stringify';
import { fixNum } from './utils';

const shoalId = 'R1';
const { width: bounds_width } = shoal_data.bounds;
const pool_width = 1920;
const pool_height = 750;
const all_width = 2 * bounds_width + pool_width;
const result_fish = [];

const fish_list = shoal_data.fish;
for (const fish of fish_list) {
    const { pos, typeId: fishId } = fish;
    let { y, x } = pos;
    if (y > pool_height) {
        y = y - pool_height;
        x = x + bounds_width;
    }
    const startTimeRadio = fixNum(x / all_width, 5);
    const endTimeRadio = fixNum((x + pool_width) / all_width, 5);

    result_fish.push({
        displaceType: 'fun',
        fishId,
        startTimeRadio,
        endTimeRadio,
        displaceLen: pool_width,
        funList: [
            {
                funNo: '3',
                radio: 1,
                params: [
                    {
                        x: 1920,
                        y,
                    },
                    {
                        x: 0,
                        y,
                    },
                ],
            },
        ],
    });
}

write(
    path.resolve(__dirname, '../../../test/app/game/shoal/shoal1.json'),
    stringify({
        shoalId,
        totalTime: 100,
        usedTime: 0,
        fish: result_fish,
    }),
);
