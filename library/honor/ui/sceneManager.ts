import { Laya } from 'Laya';
import { loadDialog, loadScene, ProgressFn } from 'honor/utils/loadRes';
import { injectAfter } from 'honor/utils/tool';
import { Event } from 'laya/events/Event';
import { Dialog } from 'laya/ui/Dialog';

import { HonorDialog, HonorScene } from './view';

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

type Opt<T extends HonorDialog> = {
    use_exist?: boolean;
    /** 是否只能存在一个场景中 */
    stay_scene?: boolean;
    beforeOpenParam?: Parameters<T['onBeforeOpen']>;
};
const loading_map: { [key: string]: Promise<HonorDialog> } = {};
export async function openDialog<T extends HonorDialog>(
    url: string,
    opt?: Opt<T>,
    fn?: ProgressFn,
): Promise<T> {
    let detectChange: () => boolean;
    let view_wait_open: Promise<T>;
    if (opt?.stay_scene) {
        detectChange = detectChangeScene();
    }

    if (opt?.use_exist) {
        view_wait_open = loading_map[url] as Promise<T>;
    }

    if (!view_wait_open) {
        view_wait_open = loading_map[url] = loadDialog(url, fn).then((view) => {
            loading_map[url] = Promise.resolve(view);
            return view;
        }) as Promise<T>;
    }

    const view = await view_wait_open;

    Laya.stage.offAllCaller(view);
    Laya.stage.on(Event.RESIZE, view, () => {
        view.onResize?.(Laya.stage.width, Laya.stage.height);
    });
    view.onResize?.(Laya.stage.width, Laya.stage.height);
    view.once(Event.UNDISPLAY, view, () => {
        Laya.stage.offAllCaller(view);
    });

    const beforeOpenParam = opt?.beforeOpenParam || ([] as any);
    // TipPop 让 open在计算大小之后再执行open
    view.onBeforeOpen?.(...beforeOpenParam);
    view.open(false);

    // 黑魔法 在view掉用destroy后执行
    injectAfter(view as Dialog, 'destroy', () => {
        if (loading_map[url]) {
            delete loading_map[url];
        }
    });

    if (opt?.stay_scene && detectChange()) {
        throw Error('change scene! dialog cant open in diff scene!');
    }
    return view;
}
