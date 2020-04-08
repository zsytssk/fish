import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from 'data/audioRes';
import { Event } from 'laya/events/Event';
import { onLangChange, offLangChange } from 'ctrl/hall/hallCtrlUtil';
import { Lang, InternationalTip } from 'data/internationalConfig';

type CloseType = 'close' | 'confirm' | 'cancel';
type Opt = {
    hide_cancel: boolean;
};
export default class AlertPop extends ui.pop.alert.alertUI
    implements HonorDialog {
    public isModal = true;
    public close_resolve: (type: CloseType) => void;
    public static async alert(msg: string, opt?: Opt) {
        AudioCtrl.play(AudioRes.PopShow);
        const alert = (await honor.director.openDialog(AlertPop)) as AlertPop;
        return await alert.alert(msg, opt);
    }
    public onAwake() {
        onLangChange(this, lang => {
            this.initLang(lang);
        });
        this.initEvent();
    }
    private initEvent() {
        const { btn_confirm, btn_cancel } = this;
        btn_confirm.on(Event.CLICK, btn_confirm, (e: Event) => {
            e.stopPropagation();
            this.close('confirm');
        });
        btn_cancel.on(Event.CLICK, btn_confirm, (e: Event) => {
            e.stopPropagation();
            this.close('cancel');
        });
    }
    public alert(msg: string, opt = {} as Opt) {
        return new Promise((resolve, reject) => {
            const { hide_cancel } = opt;
            const { label, btn_cancel, btn_confirm } = this;
            label.text = msg;
            this.close_resolve = resolve;

            if (hide_cancel) {
                btn_cancel.visible = false;
                btn_confirm.x = 127;
            } else {
                btn_cancel.visible = true;
                btn_confirm.x = 255;
            }
        }) as Promise<CloseType>;
    }
    public close(type: CloseType) {
        AudioCtrl.play(AudioRes.Click);
        const { close_resolve } = this;
        if (close_resolve) {
            close_resolve(type);
        }
        this.close_resolve = undefined;
        super.close(type);
    }
    private initLang(lang: Lang) {
        const { title, btn_confirm_label, btn_cancel_label } = this;
        const { tips, cancel, confirm } = InternationalTip[lang];
        title.text = tips;
        btn_confirm_label.text = confirm;
        btn_cancel_label.text = cancel;
    }
    public destroy() {
        offLangChange(this);
    }
}
