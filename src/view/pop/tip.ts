import { ui } from '../../ui/layaMaxUI';
import honor, { HonorDialog } from 'honor';

export const tip_url = `pop/tip.scene`;
export default class Tip extends ui.pop.tipUI implements HonorDialog {
    private close_callback: (msg) => void;
    constructor() {
        super();
    }
    public static preOpen(msg: string) {
        return honor.director.openDialog(tip_url, [msg]);
    }
    public onMounted(msg: string, close_callback: (msg) => void) {
        this.msg.text = msg;
        this.close_callback = close_callback;
    }
    public onClosed(t) {
        console.log(t);
        if (this.close_callback) {
            this.close_callback(t);
        }
    }
}
