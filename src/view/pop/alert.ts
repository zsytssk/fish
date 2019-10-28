import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';

type CloseType = 'close' | 'confirm' | 'cancel';
export default class AlertPop extends ui.pop.alert.alertUI
    implements HonorDialog {
    public isModal = true;
    public close_resolve: (type: CloseType) => void;
    public static async alert(msg: string) {
        const alert = (await honor.director.openDialog(AlertPop)) as AlertPop;
        await alert.alert(msg);
    }
    public onAwake() {
        this.initEvent();
    }
    private initEvent() {
        const { btn_confirm, btn_cancel } = this;
        btn_confirm.on(Laya.Event.CLICK, btn_confirm, (e: Laya.Event) => {
            e.stopPropagation();
            this.close('confirm');
        });
        btn_cancel.on(Laya.Event.CLICK, btn_confirm, (e: Laya.Event) => {
            e.stopPropagation();
            this.close('cancel');
        });
    }
    public alert(msg: string) {
        return new Promise((resolve, reject) => {
            const { label } = this;
            label.text = msg;
            this.close_resolve = resolve;
        });
    }
    public close(type: CloseType) {
        const { close_resolve } = this;
        if (close_resolve) {
            close_resolve(type);
        }
        this.close_resolve = undefined;
        super.close(type);
    }
}
