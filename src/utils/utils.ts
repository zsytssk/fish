import { ColorFilter } from 'laya/filters/ColorFilter';
import { GlowFilter } from 'laya/filters/GlowFilter';
import { Sprite } from 'laya/display/Sprite';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Handler } from 'laya/utils/Handler';
import { Event } from 'laya/events/Event';

export function isFunc(func: Func<void>): boolean {
    return func && typeof func === 'function';
}

export function callFunc<T extends (...params: any[]) => void>(
    func: T,
    ...params: Parameters<T>
) {
    if (!isFunc(func)) {
        return;
    }
    func(...params);
}

/** set object properties */
export function setProps<T>(data: T, props: Partial<T>) {
    for (const key in props) {
        if (!props.hasOwnProperty(key)) {
            continue;
        }
        data[key] = props[key];
    }
}

type ChangeNumType = 'add' | 'minus';
/** 有规律增加或减少数字 */
export function changeNum(num: number, type = 'add' as ChangeNumType) {
    const num_arr = splitNum(num);
    if (type === 'add') {
        const add_num = addZeroToNum(1, num_arr.length - 1);
        return num + add_num;
    } else {
        const last = num_arr[0];
        let minus_num: number;
        if (last === 1) {
            minus_num = addZeroToNum(1, num_arr.length - 2);
        } else {
            minus_num = addZeroToNum(1, num_arr.length - 1);
        }
        return num - minus_num;
    }
}

/** 数字转化为数组 */
export function splitNum(num: number, arr: number[] = []): number[] {
    if (num < 1) {
        return arr;
    }
    const last = num % 10;
    const new_num = (num - last) / 10;
    arr.unshift(last);
    return splitNum(new_num, arr);
}

/** 在数字后面添加多少位的0 */
export function addZeroToNum(num: number, len: number): number {
    len -= 1;
    if (len < 0) {
        return num;
    }
    num = num * 10;
    return addZeroToNum(num, len);
}

/** 停止骨骼动画, 如果是拖到页面上的 一开始无法停止 需要特殊处理` */
export function stopSkeleton(ani: Skeleton) {
    if (ani.player) {
        ani.stop();
        return;
    }
    ani.once(Event.PLAYED, ani, () => {
        setTimeout(() => {
            ani.stop();
        });
    });
}
/** 播放骨骼动画, 如果是拖到页面上的 一开始播放 需要特殊处理` */
type Params = [any, boolean, boolean?, number?, number?, boolean?];

export function playSkeleton(ani: Skeleton, ...params: Params) {
    if (ani.player) {
        ani.play(...params);
        return;
    }
    ani.once(Event.PLAYED, ani, () => {
        setTimeout(() => {
            ani.play(...params);
        });
    });
}

export function playSkeletonOnce(ani: Skeleton, ani_name: string) {
    return new Promise((resolve, reject) => {
        ani.once(Event.STOPPED, ani, () => {
            resolve();
        });
        if (ani.player) {
            ani.play(ani_name, false);
            return;
        }

        ani.once(Event.PLAYED, ani, () => {
            setTimeout(() => {
                ani.play(ani_name, false);
            });
        });
    });
}

/** 改变骨骼动画的url */
export function utilSkeletonLoadUrl(ani: Skeleton, url: string) {
    return new Promise((resolve, reject) => {
        ani.load(
            url,
            new Handler(ani, () => {
                resolve();
            }),
        );
    });
}

export function createRedFilter() {
    // prettier-ignore
    const redMat = [
        0.5, 0.5, 0.5, 0, 0, // R
        0, 0, 0, 0, 0, // G
        0, 0, 0, 0, 0, // B
        0, 0, 0, 1, 0, // A
    ];

    // 创建一个颜色滤镜对象,红色
    return new ColorFilter(redMat);
}

export function createDarkFilter(radio: number = 0.7) {
    const mat_val = 1 - radio;
    // prettier-ignore
    const mat = [
        mat_val, 0, 0, 0, 0,
        0, mat_val, 0, 0, 0,
        0, 0, mat_val, 0, 0,
        0, 0, 0, 1, 0,
    ];
    return new ColorFilter(mat);
}

export function createGLowRedFilter() {
    return new GlowFilter('#ff0000', 10, 0, 0);
}

export function darkNode(node: Sprite) {
    node.filters = [createDarkFilter()];
}
export function unDarkNode(node: Sprite) {
    node.filters = null;
}

export function genRandomStr() {
    return Math.random().toString().replace('0.', '');
}

let param_map: { [key: string]: string };
export function getParams(key: string) {
    if (!param_map) {
        param_map = {};
        window.location.href.replace(
            /[?&]+([^=&]+)=([^&]*)/gi,
            (m, _key, value) => {
                param_map[_key] = value;
                return value;
            },
        );
    }
    return param_map[key];
}
