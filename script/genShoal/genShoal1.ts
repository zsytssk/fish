import * as path from 'path';
import { write } from '../zutil/ls/write';
import shoal_data from './data/shoal1.source.json';
import { stringify } from '../zutil/utils/stringify';

const shoalId = 'R1';
const { width: bounds_width } = shoal_data.bounds;
const pool_width = 1920;
const pool_height = 750;
const all_width = 2 * bounds_width + pool_width;
const result_fish = [];

const fish_list = shoal_data.fish;
console.log(`${shoalId}:>`, fish_list.length);
for (const fish of fish_list) {
    const { startPos, typeId: fishId } = fish;
    let { y, x } = startPos;
    if (y > pool_height) {
        y = y - pool_height;
        x = x + bounds_width;
    }
    const startTimeRadio = Number((x / all_width).toFixed(5));
    const endTimeRadio = Number(((x + pool_width) / all_width).toFixed(5));

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
    path.resolve(__dirname, 'data/shoal1.json'),
    stringify({
        shoalId,
        totalTime: 30,
        usedTime: 0,
        fish: result_fish,
    }),
);
