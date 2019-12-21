import honor, { HonorDialog } from 'honor';
import { Dialog } from 'laya/ui/Dialog';

export default class EmptyPop extends Dialog implements HonorDialog {
    public isModal = true;
    public static preEnter() {
        honor.director.openDialog(EmptyPop);
    }
    public onMounted() {
        console.log('EmptyScene enable');
    }
}
