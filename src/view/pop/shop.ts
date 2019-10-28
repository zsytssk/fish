import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';

export default class ShopPop extends ui.pop.shop.shopUI implements HonorDialog {
    public isModal = true;
    public static preEnter() {
        honor.director.openDialog(ShopPop);
    }
    public onMounted() {
        console.log('EmptyScene enable');
    }
}
