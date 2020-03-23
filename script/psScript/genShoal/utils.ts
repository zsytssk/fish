import { displaceType } from './shoal';

type LineFishData = {
    pos: Point;
    fishId: string;
    all_width: number;
    displaceLen: number;
};

/** 直线水平 */
export function genLineTypeFish(data: LineFishData) {
    const { pos, fishId, all_width, displaceLen } = data;
    const { y, x } = pos;
    const startTimeRadio = fixNum(x / all_width, 5);
    const endTimeRadio = fixNum((x + displaceLen) / all_width, 5);
    const fun = genLineFun(
        {
            x: 1920,
            y,
        },
        {
            x: 0,
            y,
        },
        1,
    );
    return {
        displaceType: 'fun' as displaceType,
        fishId,
        startTimeRadio,
        endTimeRadio,
        displaceLen,
        funList: [fun],
    };
}

export function genLineFun(start_pos: Point, end_pos: Point, radio: number) {
    return {
        funNo: '3',
        radio,
        params: [
            {
                ...start_pos,
            },
            {
                ...end_pos,
            },
        ],
    };
}

export function fixNum(num: number, fix_num: number) {
    return Number(num.toFixed(fix_num));
}
