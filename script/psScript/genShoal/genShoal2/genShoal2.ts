import * as path from 'path';
import { write } from '../../../zutil/ls/write';
import shoal_data from '../data/shoal2.source.json';
import { stringify } from '../../../zutil/utils/stringify';
import { genLineTypeFish, genLineFun } from '../utils';
import { ShoalFishInfo, displaceType } from '../shoal';
import { formatType3Arr, genType3Path } from './genShoal2Utils';

const {
    bounds: { width: psd_width },
    shoalId,
    fish_map,
    path: path_data,
} = shoal_data;
const pool_width = 1920;
const all_width = psd_width + pool_width;

/** 直线移动大鱼 */
const type1_fish = [] as ShoalFishInfo[];
let fish_type1_arr = fish_map['0'];
fish_type1_arr = fish_type1_arr.sort((a, b) => {
    return a.pos.x - b.pos.x;
});
const first_data = fish_type1_arr[0];
const last_data = fish_type1_arr[fish_type1_arr.length - 1];
const first_fish_start = first_data.pos.x;
const last_fish_len = last_data.pos.x + pool_width;
for (const fish_type1 of fish_type1_arr) {
    const { pos, fishType: fishId } = fish_type1;
    const fish_data = genLineTypeFish({
        pos,
        fishId: fishId + '',
        all_width,
        displaceLen: pool_width,
    });
    type1_fish.push(fish_data);
}

/** 炸弹乌龟 */
const start_x = (psd_width - pool_width) / 2;
const type2_fish = [] as ShoalFishInfo[];
const fish_type2_arr = fish_map['1'];
const first_fish = type1_fish[0];
const last_fish = type1_fish[type1_fish.length - 1];
const type2_start_radio = first_fish.startTimeRadio;
const type2_end_radio = last_fish.endTimeRadio;
const type2_fish_len = last_fish_len - first_fish_start;
fish_type2_arr.map(item => {
    item.pos.x -= start_x;
});
for (const fish_type2 of fish_type2_arr) {
    const {
        pos: { x, y },
        fishType: fishId,
    } = fish_type2;

    /** 是否从左边出来的 */
    let is_left = true;
    if (x > pool_width / 2) {
        is_left = false;
    }
    const start1_pos = { x: is_left ? 0 : pool_width, y };
    const end1_pos = { x, y };
    const radio1 = Math.abs(end1_pos.x - start1_pos.x) / type2_fish_len;
    const fun1 = genLineFun(start1_pos, end1_pos, radio1);

    const start3_pos = { x, y };
    const end3_pos = { x: is_left ? pool_width : 0, y };
    const radio3 = Math.abs(end3_pos.x - start3_pos.x) / type2_fish_len;
    const fun3 = genLineFun(start3_pos, end3_pos, radio3);

    const start2_pos = { x, y };
    const end2_pos = { x, y };
    const radio2 = 1 - radio3 - radio1;
    const fun2 = genLineFun(start2_pos, end2_pos, radio2);

    type2_fish.push({
        displaceType: 'fun' as displaceType,
        fishId: fishId + '',
        startTimeRadio: type2_start_radio,
        endTimeRadio: type2_end_radio,
        displaceLen: type2_fish_len,
        dieReBorn: true,
        funList: [fun1, fun2, fun3],
    });
}

/** 正弦曲线 */
const type3_fish = [] as ShoalFishInfo[];
const type3_arr1 = formatType3Arr(fish_map['2'], start_x);
const type3_arr2 = formatType3Arr(fish_map['3'], start_x);
const type3_arr3 = formatType3Arr(fish_map['4'], start_x);
const type3_arr4 = formatType3Arr(fish_map['5'], start_x);

const type3_start_radio1 = first_fish.startTimeRadio;
const type3_end_radio1 =
    first_fish.startTimeRadio +
    (last_fish.endTimeRadio - first_fish.startTimeRadio) / 2;
const type3_start_radio2 = type3_end_radio1;
const type3_end_radio = last_fish.endTimeRadio;
const type3_all_len = type3_arr1[type3_arr1.length - 1].pos.x + pool_width;
const type3_all_radio = type3_end_radio1 - type3_start_radio1;
for (const fish of type3_arr1) {
    const {
        pos: { x },
    } = fish;
    const startTimeRadio =
        (type3_all_radio * x) / type3_all_len + type3_start_radio1;
    const endTimeRadio =
        (type3_all_radio * (x + pool_width)) / type3_all_len +
        type3_start_radio1;
    const data = genType3Path({
        fish,
        startTimeRadio,
        endTimeRadio,
        params: path_data['2'],
        displaceLen: pool_width,
        reverse: true,
    });
    type3_fish.push(data);
}

for (const fish of type3_arr2) {
    const {
        pos: { x },
    } = fish;
    const startTimeRadio =
        (type3_all_radio * x) / type3_all_len + type3_start_radio1;
    const endTimeRadio =
        (type3_all_radio * (x + pool_width)) / type3_all_len +
        type3_start_radio1;
    const data = genType3Path({
        fish,
        startTimeRadio,
        endTimeRadio,
        params: path_data['3'],
        displaceLen: pool_width,
    });
    type3_fish.push(data);
}

for (const fish of type3_arr3) {
    const {
        pos: { x },
    } = fish;
    const startTimeRadio =
        (type3_all_radio * x) / type3_all_len + type3_start_radio2;
    const endTimeRadio =
        (type3_all_radio * (x + pool_width)) / type3_all_len +
        type3_start_radio2;
    const data = genType3Path({
        fish,
        startTimeRadio,
        endTimeRadio,
        params: path_data['4'],
        displaceLen: pool_width,
    });
    type3_fish.push(data);
}

for (const fish of type3_arr4) {
    const {
        pos: { x },
    } = fish;
    const startTimeRadio =
        (type3_all_radio * x) / type3_all_len + type3_start_radio2;
    const endTimeRadio =
        (type3_all_radio * (x + pool_width)) / type3_all_len +
        type3_start_radio2;

    const data = genType3Path({
        fish,
        startTimeRadio,
        endTimeRadio,
        params: revertPath(path_data['5']),
        displaceLen: pool_width,
    });
    type3_fish.push(data);
}

function revertPath(path_arr: number[][]) {
    const result = [];
    for (const path_item of path_arr) {
        let temp = [];
        const temp_result = [];
        for (const [index, item] of path_item.entries()) {
            temp.push(item);
            if (temp.length === 2) {
                temp_result.push(temp);
                temp = [];
            }
        }
        result.push((temp_result.reverse() as any).flat());
    }

    return [...result].reverse();
}

write(
    path.resolve(__dirname, '../../../../test/app/game/shoal/shoal2.json'),
    stringify({
        shoalId,
        totalTime: 100,
        usedTime: 0,
        fish: [...type1_fish, ...type2_fish, ...type3_fish],
    }),
);
