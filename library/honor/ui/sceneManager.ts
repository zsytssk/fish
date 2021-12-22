import { Laya } from 'Laya';
import { fakeLoad, loadScene, ProgressFn } from 'honor/utils/loadRes';
import { Event } from 'laya/events/Event';

import { HonorScene } from './view';

export type SceneChangeData = {
    cur: string | undefined;
    prev: string | undefined;
};

export type SceneRefUrl = string | Ctor<HonorScene> | HonorScene;
type SceneMap = Map<SceneRefUrl, HonorScene>;
const scene_pool = new Map() as SceneMap;
export let cur_scene: HonorScene;
export let isLoadingScene = false;
export async function runScene(url: string, fn?: ProgressFn) {
    let view = scene_pool.get(url);

    isLoadingScene = true;
    if (!view) {
        view = await loadScene(url, fn);
    } else {
        await fakeLoad(0.5, fn);
    }

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
