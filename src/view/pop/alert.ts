import { HonorDialog, HonorDialogConfig } from 'honor';
import { openDialog } from 'honor/utils/loadRes';
import { Event } from 'laya/events/Event';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { getLang } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { InternationalTip } from '@app/data/internationalConfig';
import { ui } from '@app/ui/layaMaxUI';

type CloseType = 'close' | 'confirm' | 'cancel';
type Opt = {
    hide_cancel?: boolean;
    confirm_text?: string;
} & HonorDialogConfig;
export default class AlertPop
    extends ui.pop.alert.alertUI
    implements HonorDialog
{
    public isModal = true;
    shadowAlpha: 0.1;
    public close_resolve: (type: CloseType) => void;
    public get zOrder() {
        return 100;
    }
    public static async alert(msg: string, opt = {} as Opt) {
        const { hide_cancel, confirm_text } = opt;
        AudioCtrl.play(AudioRes.PopShow);
        const alert = (await openDialog('pop/alert/alert.scene')) as AlertPop;
        return await alert.alert(msg, { hide_cancel, confirm_text });
    }
    public onAwake() {
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
        this.initLang();

        return new Promise((resolve, _reject) => {
            const { hide_cancel, confirm_text } = opt;
            const { label, btn_cancel, btn_confirm, btn_confirm_label } = this;
            label.text = msg;
            this.close_resolve = resolve;

            if (hide_cancel) {
                btn_cancel.visible = false;
                btn_confirm.x = 127;
            } else {
                btn_cancel.visible = true;
                btn_confirm.x = 255;
            }

            if (confirm_text) {
                btn_confirm_label.text = confirm_text;
            }
        }) as Promise<CloseType>;
    }
    public onClosed(type: CloseType) {
        AudioCtrl.play(AudioRes.Click);
        const { close_resolve } = this;
        if (close_resolve) {
            close_resolve(type);
        }
        this.close_resolve = undefined;
    }
    private initLang() {
        const lang = getLang();
        const { title, btn_confirm_label, btn_cancel_label } = this;
        const { tips, cancel, confirm } = InternationalTip[lang];
        title.text = tips;
        btn_confirm_label.text = confirm;
        btn_cancel_label.text = cancel;
    }
}
