import honor, { HonorDialog } from 'honor';
import { ui } from '../../ui/layaMaxUI';
import { log } from 'utils/log';
import { EventCom } from 'comMan/eventCom';

export const LoadingEvent = {
    Hide: 'hide',
    Show: 'show',
};
/** loading场景 */
export default class Loading extends ui.scenes.loadingUI {
    public zOrder = 100;
    public event_com = new EventCom();
    public static instance: Loading;
    constructor() {
        super();
        this.popupEffect = undefined;
        this.closeEffect = undefined;
        Loading.instance = this;
    }

    public onShow() {
        log('load:>onShow');
        this.open(false);
        honor.director.openDialog(this as HonorDialog);
        this.event_com.emit(LoadingEvent.Show);
    }

    public onHide() {
        log('load:>onHide');
        this.close();
        this.event_com.emit(LoadingEvent.Show);
    }

    public onProgress(val: number) {
        this.progress.value = val;
    }
}
