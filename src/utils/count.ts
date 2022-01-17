import { loop, clear } from './zTimer';

type CountFn = (rate: number) => void;

let count_index = 0;
const count_map: Map<number, { off: FuncVoid; complete: FuncVoid }> = new Map();
/**
 * 倒计时
 * @param time 总时间
 * @param delta (ms) tick 时间
 * @param fn 每次调用时间
 */
export function startCount(time: number, delta: number, fn: CountFn) {
    const cur_count_index = count_index++;
    const count = time / delta;
    let i = 0;
    const count_fn = (n: number) => {
        i += n;
        if (i >= count) {
            fn(0);
            return clearCount(cur_count_index);
        }
        fn((count - i) / count);
    };

    loop(count_fn, delta * 1000, null);
    const off = () => {
        clear(count_fn, null);
    };
    const complete = () => {
        fn(0);
    };
    fn(1);
    count_map.set(cur_count_index, { off, complete });
    return cur_count_index;
}

/** 清理倒计时 */
export function clearCount(index: number, finish = false) {
    const item = count_map.get(index);
    if (!item) {
        return;
    }
    if (finish) {
        item.complete();
    }
    item.off();
    count_map.delete(index);
    if (count_map.size === 0) {
        // count_index = 0;
    }
}
