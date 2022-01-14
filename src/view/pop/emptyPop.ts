import honor, { HonorDialog } from 'honor';
import { Dialog } from 'laya/ui/Dialog';

import { log } from '@app/utils/log';

export default class EmptyPop extends Dialog implements HonorDialog {
    public static preEnter() {
        honor.director.openDialog(EmptyPop);
    }
    public onEnable() {
        log('EmptyScene enable');
    }
}
