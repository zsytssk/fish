import { Scene } from 'laya/display/Scene';

import { initDialog, openDialog } from './dialogManager';
import { cur_scene, isLoadingScene, runScene } from './sceneManager';
import { HonorDialog, HonorScene } from './view';

export class DirectorCtor {
    public init() {
        initDialog();
    }

    /**
     * 运行场景
     * @param url 场景的url
     */
    public runScene(...params: Parameters<typeof runScene>): Promise<Scene> {
        return runScene(...params);
    }
    /**
     * 是否正在 loadingscene
     * @param url 场景的url
     */
    get isLoadingScene(): boolean {
        return isLoadingScene;
    }

    /**
     * 获取当前正在运行场景
     * @param url 场景的url
     */
    get runningScene(): HonorScene {
        return cur_scene;
    }

    public openDialog<T extends HonorDialog>(
        ...params: Parameters<typeof openDialog>
    ) {
        return openDialog<T>(...params);
    }
}
