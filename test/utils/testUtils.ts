import { injectProto } from 'honor/utils/tool';

/** 检测stage上点击元素 */
export function stageClick() {
    Laya.stage.on('click', null, (e: Event) => {
        console.log(`test:>`, e.target);
    });
}
export function showNodeZone(sprite: Laya.Sprite) {
    sprite.graphics.alpha(0.3);
    sprite.graphics.drawRect(0, 0, sprite.width, sprite.height, '#000');
}
export function sleep(time: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time * 1000);
    });
}
export function nameMap(path: string | string[], end_obj: any, obj?: any) {
    if (typeof path === 'string') {
        path = path.split('.');
    }
    if (!obj) {
        obj = window;
    }
    const cur_path = path.shift();
    if (path.length === 0) {
        return (obj[cur_path] = end_obj);
    }

    if (!obj[cur_path]) {
        obj[cur_path] = {};
    }
    return nameMap(path, end_obj, obj[cur_path]);
}

let test_ignore_arr: string[] = [];
/** 测试是否需要跳过 */
export function getTestIgnore() {
    if (!test_ignore_arr.length) {
        const test_str = Laya.Utils.getQueryString('test_ignore');
        if (!test_str) {
            return test_ignore_arr;
        }
        test_ignore_arr = test_str.split(',');
    }
    return test_ignore_arr;
}

let test_enable_arr: string[] = [];
/** 测试开启 */
export function getTestEnable() {
    if (!test_enable_arr.length) {
        const test_str = Laya.Utils.getQueryString('test_enable');
        if (!test_str) {
            return test_enable_arr;
        }
        test_enable_arr = test_str.split(',');
    }
    return test_enable_arr;
}
