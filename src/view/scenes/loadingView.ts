import honor, { HonorDialog } from 'honor';
import { ui } from '../../ui/layaMaxUI';
import { log } from 'utils/log';

/** loading场景 */
export default class Loading extends ui.scenes.loadingUI {
    public zOrder = 100;
    constructor() {
        super();
        this.popupEffect = undefined;
        this.closeEffect = undefined;
    }

    public onShow() {
        this.open(false);
        honor.director.openDialog(this as HonorDialog);
        log('LoadingScene onReset');
    }

    public onHide() {
        this.close();
        log('LoadingScene onReset');
    }

    public onProgress(val: number) {
        this.progress.value = val;
    }
}
