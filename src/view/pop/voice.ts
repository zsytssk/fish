import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';

export default class VoicePop extends ui.pop.alert.voiceUI
    implements HonorDialog {
    public isModal = true;
    public static preEnter() {
        honor.director.openDialog(VoicePop);
    }
    public onMounted() {
        console.log('EmptyScene enable');
    }
}
