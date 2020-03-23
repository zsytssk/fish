import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { log } from 'utils/log';

export default class HelpPop extends ui.pop.helpUI implements HonorDialog {
    public isModal = true;
    public static preEnter() {
        honor.director.openDialog(HelpPop);
    }
    public onMounted() {
        log('EmptyScene enable');
    }
}
