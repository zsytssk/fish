import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';

export default class BulletBulletPop extends ui.pop.alert.buyBulletUI
    implements HonorDialog {
    public isModal = true;
    public static preEnter() {
        honor.director.openDialog(BulletBulletPop);
    }
    public onMounted() {
        console.log('EmptyScene enable');
    }
}
