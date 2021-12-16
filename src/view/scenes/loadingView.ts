import { EventCom } from 'comMan/eventCom';
import { loadDialog } from 'honor/utils/loadRes';

import { log } from '@app/utils/log';

import { ui } from '../../ui/layaMaxUI';

export const LoadingEvent = {
    Hide: 'hide',
    Show: 'show',
};
/** loading场景 */

export default class Loading extends ui.scenes.loadingUI {
    public _zOrder = 100;
    public get zOrder() {
        return this._zOrder;
    }
    public set zOrder(value) {
        this._zOrder = value;
    }
    public static event_com = new EventCom();
    public static instance: Loading;
    public static timeout: any;
    public static isLoadingView = true;
    public static async load() {
        if (this.instance) {
            return this.instance;
        }
        return (Loading.instance = (await loadDialog(
            'scenes/loading.scene',
        )) as Loading);
    }

    constructor() {
        super();
        this.popupEffect = undefined;
        this.closeEffect = undefined;
        Loading.instance = this;
    }

    public onShow() {
        log('load:>onShow', this);
        clearTimeout(Loading.timeout);
        Loading.event_com.emit(LoadingEvent.Show);
        this.open(false);
        this.progress.value = 0;
    }

    public onHide() {
        log('load:>onHide');
        Loading.timeout = setTimeout(() => {
            Loading.event_com.emit(LoadingEvent.Hide);
            this.close();
        }, 300);
    }

    public onProgress(val: number) {
        this.progress.value = val;
    }
}
