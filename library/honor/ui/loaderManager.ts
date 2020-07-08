import { ViewType, HonorLoadScene, HonorView } from './view';
import { ResItem, loadRes } from 'honor/utils/loadRes';
import { Scene } from 'laya/display/Scene';
import { Dialog } from 'laya/ui/Dialog';
import { Handler } from 'laya/utils/Handler';
import { sleep } from 'utils/animate';
import { LoaderManager } from 'laya/net/LoaderManager';
import { Laya } from 'Laya';

type LoadingMap = Map<ViewType, HonorLoadScene>;
export class LoaderManagerCtor {
    private load_tasks: Set<{ task: Promise<any>; type: ViewType }> = new Set();
    private load_map = new Map() as LoadingMap;
    public loadScene(type: ViewType, url: string, preLoad = false) {
        /** 加载场景时 清除正在加载的东西 防止影响场景加载 */
        if (preLoad && type === 'Scene') {
            Laya.loader.clearUnLoaded();
        }
        const load_task = new Promise((resolve, reject) => {
            const ctor = type === 'Scene' ? Scene : Dialog;
            ctor.load(
                url,
                Handler.create(this, (_scene: HonorView) => {
                    resolve(_scene);
                }),
                Handler.create(this, this.setLoadProgress, [type], false),
            );
        });
        if (!preLoad) {
            this.addLoadTask(type, load_task);
        }
        return load_task;
    }
    public preLoad(type: ViewType, url: string) {
        this.loadScene(type, url, true);
    }
    public load(res: ResItem[] | string[], type?: ViewType) {
        const load_task = new Promise(async (resolve, reject) => {
            let load_progress_fn;
            if (type) {
                load_progress_fn = (val: number) => {
                    this.setLoadProgress(type, val);
                };
            }
            await loadRes(res, load_progress_fn);

            /** 如果显示loading, 最少显示500ms */
            return resolve();
        });
        this.addLoadTask(type, load_task);
        return load_task;
    }
    public addLoadTask(type: ViewType, load_task: Promise<any>) {
        if (!type) {
            return;
        }
        const { load_tasks } = this;
        /** loading 最少显示一秒 */
        this.setLoadViewVisible(type, true);
        const wait_close = Promise.all([load_task, sleep(1)]).then(() => {
            /** 是否有type一致的正在加载的任务 */
            let has_loading_task = false;
            for (const item of load_tasks) {
                if (item.task === wait_close) {
                    load_tasks.delete(item);
                    continue;
                }
                if (item.type === type) {
                    has_loading_task = true;
                }
            }
            if (!has_loading_task) {
                this.setLoadViewVisible(type, false);
            }
        });
        this.load_tasks.add({ task: wait_close, type });
    }

    public async setLoadView(type: ViewType, url: string) {
        const ctor = type === 'Scene' ? Scene : Dialog;
        const scene: HonorLoadScene = await new Promise((resolve, reject) => {
            ctor.load(
                url,
                Handler.create(null, (_scene: HonorLoadScene) => {
                    resolve(_scene);
                }),
            );
        });

        this.load_map.set(type, scene);
    }
    public setLoadViewVisible(type: ViewType, visible: boolean) {
        const load_scene = this.load_map.get(type);
        if (!load_scene) {
            return;
        }
        if (visible) {
            load_scene.onShow();
        } else {
            load_scene.onHide();
        }
    }
    public setLoadProgress(type: ViewType, val: number) {
        const load_scene = this.load_map.get(type);
        if (!load_scene) {
            return;
        }
        load_scene.onProgress(val);
    }
}
