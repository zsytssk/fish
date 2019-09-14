/** 在class的fun执行之后执行fun */
export function injectAfter(instance: any, fun_name: string, func: Func<any>) {
    const ori_fun = instance[fun_name];
    instance[fun_name] = function(...params) {
        const result = ori_fun.apply(this, [...params]);
        func(...params);
        return result;
    };
}
export function injectProto(
    ctor: any,
    fun_name: string,
    func: Func<any>,
    once?: boolean,
) {
    const ori_fun = ctor.prototype[fun_name];
    ctor.prototype[fun_name] = function(...params) {
        const result = ori_fun.apply(this, [...params]);
        func(...params);
        if (once) {
            ctor.prototype[fun_name] = ori_fun;
        }
        return result;
    };
}

/** 之所以要这个处理, 为了解决外嵌模式需要loadScene本身的资源, 干净的类 class不需要
 *  所有通过 loadScene 有没有调用来监听
 * 这是hack的方法
 */
export function createScene<T extends Laya.Scene>(ctor: Ctor<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        let is_load = false;
        /** 监听 */
        injectProto(
            ctor,
            'loadScene',
            () => {
                is_load = true;
            },
            true,
        );
        const instance = new ctor();
        if (!is_load && nodeIsReady(instance)) {
            return resolve(instance);
        }
        instance.once('onViewCreated', this, () => {
            return resolve(instance);
        });
    }) as Promise<T>;
}

export function nodeIsReady(node: Laya.Node) {
    return node._getBit(/*laya.Const.NOT_READY*/ 0x08);
}
