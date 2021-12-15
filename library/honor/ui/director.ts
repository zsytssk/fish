import { Laya } from 'Laya';
import { Scene } from 'laya/display/Scene';
import { Event } from 'laya/events/Event';

import { default as honor } from '../index';
import {
    dialogManager,
    loaderManager,
    sceneManager,
    untilInit,
} from '../state';
import { ResItem } from '../utils/loadRes';
import { SceneChangeListener, SceneRefUrl } from './SceneManager';
import { DialogOpenOpt } from './dialogManager';
import { HonorDialogConfig, HonorScene, ViewType } from './view';

export class DirectorCtor {
    public init() {
        Laya.stage.on(Event.RESIZE, this, this.onResize);
        this.onResize();
    }

    private onResize() {
        const { width, height } = Laya.stage;
        sceneManager.onResize(width, height);
        dialogManager.onResize(width, height);
    }
    /**
     * 运行场景
     * @param url 场景的url
     */
    public runScene(url: SceneRefUrl): Promise<Scene | void> {
        return sceneManager.runScene(url).catch((err) => {
            if (honor.DEBUG_MODE) {
                console.error(err);
            }
        });
    }
    /**
     * 是否正在 loadingscene
     * @param url 场景的url
     */
    get isLoadingScene(): boolean {
        return sceneManager.is_loading_scene;
    }
    /**
     * 获取当前正在运行场景
     * @param url 场景的url
     */
    get runningScene(): HonorScene {
        return sceneManager.getCurScene();
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
    public load(res: ResItem[] | string[], type?: ViewType) {
        return loaderManager.load(res, type);
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

    /** 设置scene loading页面
     */
    public setLoadPageForScene(url: string) {
        return loaderManager.setLoadView('Scene', url);
    }
    /** 设置dialog loading 页面
     */
    public setLoadPageForDialog(url: string) {
        return loaderManager.setLoadView('Dialog', url);
    }
    public async clearDialog(fn: SceneChangeListener) {
        await untilInit();
        sceneManager.sceneChangeAfterListener.push(fn);
    }
    public async onSceneChangeBefore(fn: SceneChangeListener) {
        await untilInit();
        sceneManager.sceneChangeBeforeListener.push(fn);
    }
    public async onSceneChangeAfter(fn: SceneChangeListener) {
        await untilInit();
        sceneManager.sceneChangeAfterListener.push(fn);
    }
    public async clearListener(fn: SceneChangeListener) {
        await untilInit();
        sceneManager.sceneChangeBeforeListener =
            sceneManager.sceneChangeBeforeListener.filter((item) => {
                return item !== fn;
            });
        sceneManager.sceneChangeAfterListener =
            sceneManager.sceneChangeAfterListener.filter((item) => {
                return item !== fn;
            });
    }
    /** 隐藏遮罩 */
    public hideDialog(visible: boolean) {
        dialogManager.hideMask(visible);
    }
}
