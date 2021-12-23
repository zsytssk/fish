import { combineLatest, Observable, Subscriber } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Laya, loader } from 'Laya';
import { HonorDialog } from 'honor';
import { Scene } from 'laya/display/Scene';
import { Event } from 'laya/events/Event';
import { Dialog } from 'laya/ui/Dialog';
import { Handler } from 'laya/utils/Handler';

type Ctor<T> = new (...args) => T;

export type ResItem = {
    url: string;
    type: string;
};
export interface LoadingView {
    onShow: () => void;
    onHide: () => void;
    onProgress: (radio: number) => void;
}
export type LoadingCtor = Ctor<LoadingView> & {
    load: () => Promise<LoadingView>;
    isLoadingView: boolean;
};

export type ProgressFn = (radio: number) => void;

export function openDialog(url: string, fn?: ProgressFn) {
    return loadDialog(url, fn).then((view: HonorDialog) => {
        view.open();
        Laya.stage.on(Event.RESIZE, view, () => {
            view.onResize?.(Laya.stage.width, Laya.stage.height);
        });
        view.onResize?.(Laya.stage.width, Laya.stage.height);
        view.once(Event.UNDISPLAY, view, () => {
            Laya.stage.offAllCaller(view);
        });
        return view;
    });
}

export function loadScene(url: string, fn?: ProgressFn) {
    return new Promise<Scene>((resolve) => {
        Scene.load(
            url,
            Handler.create(this, resolve, null, true),
            Handler.create(this, fn, null, false),
        );
    });
}
export function loadDialog(url: string, fn?: ProgressFn) {
    return new Promise<Scene>((resolve) => {
        Dialog.load(
            url,
            Handler.create(this, resolve, null, true),
            Handler.create(this, fn, null, false),
        );
    });
}

export function loadRes(
    res: Parameters<typeof loader.load>[0],
    fn?: ProgressFn,
) {
    return new Promise<void>((resolve) => {
        loader.load(
            res,
            new Handler(null, resolve, null, false),
            new Handler(this, fn),
        );
    });
}

export function fakeLoad(time: number, fn?: ProgressFn) {
    return new Promise<void>((resolve) => {
        let space = 0;

        const interval = setInterval(() => {
            space += 0.05;
            if (space > time) {
                clearInterval(interval);
                resolve();
                return;
            }

            fn?.(space / time);
        }, 50);
    });
}

export function toProgressObserver<T extends FuncAny>(fn: T) {
    return function (
        ...args: NotLastParameters<T>
    ): [Observable<number>, Promise<ReturnType<T>>] {
        let subscriber: Subscriber<number>;
        let resolve: (value: ReturnType<T>) => void;
        const promise = new Promise<ReturnType<T>>((_resolve) => {
            resolve = _resolve;
        });
        const observer = new Observable((_subscriber: Subscriber<number>) => {
            subscriber = _subscriber;
            fn(...args, (radio: number) => {
                subscriber?.next(radio);
            }).then((data: ReturnType<T>) => {
                subscriber?.next(1);
                subscriber?.complete();
                resolve(data);
            });
        });

        return [observer, promise];
    };
}

export function promiseToProgressObserver<T extends FuncAny>(fn: T) {
    return function (
        ...args: Parameters<T>
    ): [Observable<number>, Promise<ReturnType<T>>] {
        let subscriber: Subscriber<number>;
        let resolve: (value: ReturnType<T>) => void;
        const promise = new Promise<ReturnType<T>>((_resolve) => {
            resolve = _resolve;
        });
        const observer = new Observable((_subscriber: Subscriber<number>) => {
            subscriber = _subscriber;
            fn(...args).then((data: ReturnType<T>) => {
                subscriber?.next(1);
                subscriber?.complete();
                resolve(data);
            });
        });

        return [observer, promise];
    };
}

type LoadingProgress = [Observable<number>, Promise<unknown>];
export async function mergeProgressObserver<T extends LoadingProgress[]>(
    loadingProcess: T,
    progress?: ProgressFn | LoadingCtor,
) {
    const observerArr = [] as UnpackArrDeep<T>[0];
    const promiseArr = [] as UnpackArrDeep<T>[1];
    for (const item of loadingProcess) {
        const [progressPipe, completePromise] = item;
        observerArr.push(progressPipe.pipe(startWith(0)));
        promiseArr.push(completePromise);
    }
    const count = observerArr.length;
    const mergeProgress = combineLatest(observerArr).pipe(
        map((arr) => {
            return arr.reduce((prev, cur) => prev + cur / count, 0);
        }),
    );
    const allLoadCompleted = Promise.all(promiseArr);
    if ('isLoadingView' in progress) {
        const instance = await progress.load();
        instance.onShow();
        mergeProgress.subscribe((radio) => {
            instance.onProgress(radio);
        });
        allLoadCompleted.then(() => {
            instance.onHide();
        });
    } else if (typeof progress === 'function') {
        mergeProgress.subscribe(progress);
    } else {
        mergeProgress.subscribe();
    }

    return allLoadCompleted;
}
