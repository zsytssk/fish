import { Laya } from 'Laya';
import { injectProto } from 'honor/utils/tool';
import { Sprite } from 'laya/display/Sprite';

import { WebSocketWrapCtrl } from '@app/ctrl/net/webSocketWrap';
import { getSocket } from '@app/ctrl/net/webSocketWrapUtil';
import { modelState } from '@app/model/modelState';

export function getUserInfo() {
    return modelState.app.user_info;
}
export function getCurPlayer() {
    return modelState.game.getPlayerById(modelState.app.user_info.user_id);
}

/** 等待socket连接上 */
export function waitSocketCreate(name: string) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(name);
        if (socket) {
            return resolve(socket);
        }
        injectProto(
            WebSocketWrapCtrl,
            'onInit' as any,
            (_socket: WebSocketWrapCtrl) => {
                if (socket['config'].name === name) {
                    resolve(_socket);
                }
            },
        );
    });
}

/** 检测stage上点击元素 */
export function stageClick() {
    Laya.stage.on('click', null, (e: Event) => {
        console.log(`test:>`, e.target);
    });
}
export function showNodeZone(sprite: Sprite) {
    // sprite.graphics.alpha(0.3);
    sprite.graphics.drawRect(0, 0, sprite.width, sprite.height, 'red');
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
export function injectWindow(obj: { [key: string]: any }) {
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        nameMap(key, obj[key]);
    }
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
