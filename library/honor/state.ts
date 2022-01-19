import { DirectorCtor } from './ui/director';

export const director = new DirectorCtor();

/** 一切初始化+全局变量都在这里 */
export function initState() {
    director.init();
}
