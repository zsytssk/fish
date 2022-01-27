/* eslint-disable @typescript-eslint/no-explicit-any */
import { UIConfig } from 'UIConfig';

import { Laya } from 'Laya';
import { loadDialog, ProgressFn } from 'honor/utils/loadRes';
import { injectAfter } from 'honor/utils/tool';
import { Event } from 'laya/events/Event';
import { Dialog } from 'laya/ui/Dialog';
import { Ease } from 'laya/utils/Ease';
import { Handler } from 'laya/utils/Handler';
import { Tween } from 'laya/utils/Tween';

import { cur_scene, detectChangeScene } from './sceneManager';
import { HonorDialog } from './view';

/**
 * 全局默认弹出对话框效果，可以设置一个效果代替默认的弹出效果，
 * 如果不想有任何效果，可以赋值为null
 */
const defaultPopupEffect = function (dialog: HonorDialog) {
    dialog.scale(1, 1);
    dialog.alpha = 1;
    dialog._effectTween = Tween.from(
        dialog,
        {
            x: Laya.stage.width / 2,
            y: Laya.stage.height / 2,
            scaleX: 0.2,
            scaleY: 0.2,
            alpha: 0,
        },
        300,
        Ease.backOut,
        Handler.create(this, this.doOpen, [dialog]),
        0,
        false,
        false,
    );
};
/** 全局默认关闭对话框效果，可以设置一个效果代替默认的关闭效果，
 * 如果不想有任何效果，可以赋值为null
 */
const defaultCloseEffect = function (dialog: HonorDialog) {
    dialog._effectTween = Tween.to(
        dialog,
        {
            x: Laya.stage.width / 2,
            y: Laya.stage.height / 2,
            scaleX: 0.2,
            scaleY: 0.2,
            alpha: 0,
        },
        300,
        Ease.quintOut,
        Handler.create(this, this.doClose, [dialog]),
        0,
        false,
        false,
    );
};

/**
 * <code>DialogManager</code> 对话框管理容器，所有的对话框都在该容器内，并且受管理器管理。
 * 任意对话框打开和关闭，都会触发管理类的open和close事件
 * 可以通过UIConfig设置弹出框背景透明度，模式窗口点击边缘是否关闭，点击窗口是否切换层次等
 * 通过设置对话框的zOrder属性，可以更改弹出的层次
 */

export function initDialog() {
    UIConfig.closeDialogOnSide = false;
    const dialog_manager = Dialog.manager;

    dialog_manager.popupEffectHandler = new Handler(
        dialog_manager,
        defaultPopupEffect,
    );
    dialog_manager.closeEffectHandler = new Handler(
        dialog_manager,
        defaultCloseEffect,
    );
}

export type OpenDialogOpt<T extends HonorDialog> = {
    use_exist?: boolean;
    /** 是否只能存在一个场景中 */
    stay_scene?: boolean;
    close_on_side?: boolean;
    before_open_param?: Parameters<T['onBeforeOpen']>;
};
const DEFAULT_CONFIG = {
    use_exist: true,
    stay_scene: true,
    close_on_side: true,
    before_open_param: [] as any,
};
const loading_map: { [key: string]: Promise<HonorDialog> } = {};

export async function openDialog<T extends HonorDialog>(
    url: string,
    opt = {} as OpenDialogOpt<T>,
    fn?: ProgressFn,
): Promise<T> {
    let detectChange: () => boolean;
    let view_wait_open: Promise<T>;

    opt = {
        ...DEFAULT_CONFIG,
        ...opt,
    };

    if (opt.stay_scene) {
        detectChange = detectChangeScene();
    }

    if (opt.use_exist) {
        view_wait_open = loading_map[url] as Promise<T>;
    }

    if (!view_wait_open) {
        view_wait_open = loadDialog(url, fn).then((view) => {
            if (opt.use_exist) {
                loading_map[url] = Promise.resolve(view);
            }
            return view;
        }) as Promise<T>;

        if (opt.use_exist) {
            loading_map[url] = view_wait_open;
        }
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
    if (opt.stay_scene && cur_scene) {
        Laya.stage.offAllCaller(view);
        cur_scene.once(Event.UNDISPLAY, view, () => {
            view.close();
        });
    }
    const { maskLayer } = Dialog.manager;

    // 点击空白区域 关闭弹框
    maskLayer.offAllCaller(view);
    if (opt.close_on_side) {
        maskLayer.once(Event.CLICK, view, () => {
            view.close();
        });
    }

    // TipPop 让 open在计算大小之后再执行open
    view.onBeforeOpen?.(...(opt.before_open_param as any));
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
