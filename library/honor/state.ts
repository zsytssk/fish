import { DialogManagerCtor } from './ui/dialogManager';
import { DirectorCtor } from './ui/director';

export let dialogManager: DialogManagerCtor;
export const director = new DirectorCtor();

let init_resolve = [] as Array<() => void>;

/** 一切初始化+全局变量都在这里 */
export function initState() {
    dialogManager = new DialogManagerCtor();
    director.init();

    if (init_resolve) {
        for (const item of init_resolve) {
            item();
        }
        init_resolve = undefined;
    }
}
