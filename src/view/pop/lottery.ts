import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';

export default class LotteryPop extends ui.pop.lottery.lotteryUI
    implements HonorDialog {
    public isModal = true;
    public static preEnter() {
        honor.director.openDialog(LotteryPop);
    }
    public onMounted() {
        console.log('EmptyScene enable');
    }
}
