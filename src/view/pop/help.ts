import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';

export default class HelpPop extends ui.pop.helpUI implements HonorDialog {
    public isModal = true;
    public static preEnter() {
        honor.director.openDialog(HelpPop);
    }
    public onMounted() {
        console.log('EmptyScene enable');
    }
}
