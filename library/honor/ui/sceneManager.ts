/* eslint-disable @typescript-eslint/no-explicit-any */
import { Laya } from 'Laya';
import { loadScene, ProgressFn } from 'honor/utils/loadRes';
import { Event } from 'laya/events/Event';

import { HonorScene } from './view';

export type SceneChangeData = {
    cur: string | undefined;
    prev: string | undefined;
};

export let cur_scene: HonorScene;
export let isLoadingScene = false;
export async function runScene(url: string, fn?: ProgressFn) {
    isLoadingScene = true;
    const view = (await loadScene(url, fn)) as HonorScene;

    cur_scene = view;
    isLoadingScene = false;

    view.open();
    Laya.stage.on(Event.RESIZE, view, () => {
        view.onResize(Laya.stage.width, Laya.stage.height);
    });

    view.onResize(Laya.stage.width, Laya.stage.height);
    view.once(Event.UNDISPLAY, view, () => {
        Laya.stage.offAllCaller(view);
    });

    return view;
}

export function detectChangeScene() {
    const prev = cur_scene;

    return () => {
        if (!cur_scene) {
            return true;
        }
        if (prev !== cur_scene) {
            return true;
        }
        return false;
    };
}
