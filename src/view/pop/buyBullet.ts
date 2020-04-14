import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { Lang, InternationalTip } from 'data/internationalConfig';
import { onLangChange, offLangChange } from 'ctrl/hall/hallCtrlUtil';

export default class BuyBulletPop extends ui.pop.alert.buyBulletUI
    implements HonorDialog {
    public isModal = true;
    public static preEnter() {
        honor.director.openDialog(BuyBulletPop);
    }
    public onAwake() {
        onLangChange(this, lang => {
            this.initLang(lang);
        });
    }
    private initLang(lang: Lang) {
        const { buyBullet, purchase, buyBulletCost } = InternationalTip[lang];
        const { intro, title, btn_label } = this;
        title.text = buyBullet;
        btn_label.text = purchase;
        intro.text = `${buyBulletCost}${purchase}EOS`;
    }
    public destroy() {
        offLangChange(this);
    }
}
