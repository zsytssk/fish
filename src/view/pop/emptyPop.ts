import honor, { HonorDialog } from 'honor';
import { Dialog } from 'laya/ui/Dialog';
import { log } from 'utils/log';

export default class EmptyPop extends Dialog implements HonorDialog {
    public isModal = true;
    public static preEnter() {
        honor.director.openDialog(EmptyPop);
    }
    public onMounted() {
        log('EmptyScene enable');
    }
}
