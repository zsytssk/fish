const calcGcd = (x, y) => (!y ? x : calcGcd(y, x % y));
const calcGcdArr = arr => {
    let result;
    for (const item of arr) {
        result = calcGcd(item, result);
    }
    return result;
};

type HookItem = {
    caller: any;
    delay: number;
    fun: (step: number) => void;
    off: FuncVoid;
    once: boolean;
    then: number;
};

class ZTimer {
    private hooks: HookItem[] = [];
    /**开始执行循环函数
     * fun 每次执行的执行的韩式
     * @param time 传入的间隔
     * @param space_time 间隔的时间间隔
     */
    public loop(fun, delay, caller?, once?) {
        const off = () => {
            this.clear(fun, caller);
        };
        this.hooks.push({
            caller,
            delay,
            fun,
            off,
            once,
            then: Date.now(),
        });
        this.startInterval();
        return off;
    }
    public once(fun, delay, caller) {
        return this.loop(fun, delay, caller, true);
    }
    public off(fun) {
        if (!fun) {
            return;
        }
        if (typeof fun === 'function') {
            fun();
        }
    }
    public clear(fun, caller) {
        const hooks = this.hooks;

        for (let len = hooks.length, i = len - 1; i >= 0; i--) {
            const { fun: fun_item, caller: caller_item } = hooks[i];
            if (caller_item !== caller || fun_item !== fun) {
                continue;
            }
            this.hooks.splice(i, 1);
            this.startInterval();
            return;
        }
    }
    public clearAll(caller) {
        const hooks = this.hooks;
        for (let len = hooks.length, i = len - 1; i >= 0; i--) {
            const { caller: caller_item } = hooks[i];
            if (caller === caller_item) {
                hooks.splice(i, 1);
                continue;
            }
        }
        this.startInterval();
    }
    /** 计算所有interval的最大公约数, 每gcd（最大公约数）次执行一次interval */
    private startInterval() {
        Laya.timer.clear(this, this.interval);
        const delay_arr = this.hooks.map(item => {
            return item.delay;
        });
        if (!delay_arr.length) {
            return;
        }
        const gcd = calcGcdArr(delay_arr);
        Laya.timer.loop(gcd, this, this.interval);
    }
    private interval() {
        const hooks = this.hooks;
        const len = hooks.length;
        if (!len) {
            return;
        }
        const now = Date.now();
        for (let i = len - 1; i >= 0; i--) {
            const hook_item = hooks[i];
            const { fun, then, delay, once, off } = hook_item;
            const elapsed = now - then || 0;
            if (elapsed < delay) {
                continue;
            }
            const time = Math.floor(elapsed / delay);

            const new_then = now - (elapsed - time * delay);
            if (typeof fun === 'function') {
                fun(time);
            }
            if (once) {
                off();
                continue;
            }
            hook_item.then = new_then;
        }
    }
}

export const zTimer = new ZTimer();
