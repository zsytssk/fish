import { Laya } from 'Laya';
import { Scene } from 'laya/display/Scene';
import { Event } from 'laya/events/Event';

import { dialogManager } from '../state';
import { ProgressFn } from '../utils/loadRes';
import { DialogOpenOpt } from './dialogManager';
import { cur_scene, isLoadingScene, runScene } from './sceneManager';
import { HonorDialogConfig, HonorScene } from './view';

export class DirectorCtor {
    public init() {
        Laya.stage.on(Event.RESIZE, this, this.onResize);
        this.onResize();
    }

    private onResize() {
        const { width, height } = Laya.stage;
        dialogManager.onResize(width, height);
    }
    /**
     * 运行场景
     * @param url 场景的url
     */
    public runScene(url: string, progress: ProgressFn): Promise<Scene> {
        return runScene(url, progress);
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
    /**
     * 打开弹出层
     * @param url 弹出层
     * @param config 弹出层的配置
     * @param use_exist 使用打开弹出层弹出层
     * @param show_effect 是否使用打开动画
     */
    public openDialog(opt: DialogOpenOpt, config?: HonorDialogConfig) {
        return dialogManager.openDialog(opt, config);
    }

    public getDialogByName(name: string) {
        return dialogManager.getDialogByName(name);
    }

    public getDialogsByGroup(group: string) {
        return dialogManager.getDialogsByGroup(group);
    }

    public closeDialogByName(name: string) {
        dialogManager.closeDialogByName(name);
    }

    public closeDialogsByGroup(group: string) {
        dialogManager.closeDialogsByGroup(group);
    }

    public closeAllDialogs() {
        dialogManager.closeAllDialogs();
    }
}
