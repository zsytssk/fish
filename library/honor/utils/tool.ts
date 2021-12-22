import { Node } from 'laya/display/Node';
import { Scene } from 'laya/display/Scene';
import { Sprite } from 'laya/display/Sprite';

/** 在class的fun执行之后执行fun */
export function injectAfter<T, K extends ObjFilterKeys<T, Func<unknown>>>(
    instance: T,
    fun_name: K,
    func?: Func<unknown>,
) {
    return new Promise((resolve) => {
        const ori_fun = instance[fun_name] as Func<any>;
        instance[fun_name] = function (...params: unknown[]) {
            const result = ori_fun.apply(this, [...params]);
            afterPromise(result, async () => {
                const res = await func?.(this, result, ...params);
                resolve(res);
            });
            return result;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as unknown as any;
    });
}

function afterPromise(result: unknown, fun: () => void) {
    if (result instanceof Promise) {
        result.then((_result) => {
            afterPromise(_result, fun);
        });
    } else {
        fun();
    }
}
export function injectProto<T, K extends ObjFilterKeys<T, Func<unknown>>>(
    ctor: Ctor<T>,
    fun_name: K,
    func: Func<unknown>,
    once?: boolean,
) {
    return new Promise((resolve) => {
        const ori_fun = ctor.prototype[fun_name];
        ctor.prototype[fun_name] = function (...params: unknown[]) {
            const result = ori_fun.apply(this, [...params]);
            afterPromise(result, async () => {
                const res = await func(this, result, ...params);
                resolve(res);
            });
            if (once) {
                ctor.prototype[fun_name] = ori_fun;
            }
            return result;
        };
    });
}

/** 之所以要这个处理, 为了解决外嵌模式需要loadScene本身的资源, 干净的类 class不需要
 *  所有通过 loadScene 有没有调用来监听
 * 这是hack的方法
 */
export function createScene(ctor: Ctor<Scene>): Promise<Scene> {
    return new Promise((resolve) => {
        const instance = new ctor();
        return resolve(instance);
    }) as Promise<Scene>;
}

export function afterActive(node: Sprite) {
    return new Promise((resolve) => {
        if (node.active) {
            return resolve(undefined);
        }
        node.once('onViewCreated', this, () => {
            return resolve(undefined);
        });
    });
}
export function afterEnable(node: Node) {
    return new Promise((resolve, reject) => {
        if (node.active) {
            return resolve(undefined);
        }
        injectAfter(node, 'onEnable', () => {
            resolve(undefined);
        });
        injectAfter(node, 'onDestroy', () => {
            reject();
        });
    });
}
