import { ctrlState } from 'ctrl/ctrlState';
import { getLang, offLangChange, onLangChange } from 'ctrl/hall/hallCtrlUtil';
import { SkillMap } from 'data/config';
import { InternationalTip, Lang } from 'data/internationalConfig';
import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { getCurPlayer } from 'model/modelState';
import { ui } from 'ui/layaMaxUI';
import { addZeroToNum } from 'utils/utils';
import AlertPop from './alert';
import { buyItem } from './popSocket';
import TipPop from './tip';

type BuyInfo = {
    type: string;
    id: string;
    num: number;
    price: number;
};
export default class BuyBulletPop extends ui.pop.alert.buyBulletUI
    implements HonorDialog {
    public isModal = true;
    private buy_info: BuyInfo;
    public static async preEnter(info: BuyInfo) {
        const dialog = (await honor.director.openDialog({
            dialog: BuyBulletPop,
            use_exist: true,
        })) as BuyBulletPop;
        dialog.buy(info);
    }
    public onAwake() {
        onLangChange(this, lang => {
            this.initLang(lang);
        });
        this.initEvent();
    }
    private initEvent() {
        const { btn_minus, btn_add, btn_buy } = this;
        const { CLICK } = Event;

        btn_minus.on(CLICK, this, () => {
            this.changeNum('minus');
        });
        btn_add.on(CLICK, this, () => {
            this.changeNum('add');
        });
        btn_buy.on(CLICK, this, () => {
            const lang = getLang();
            const { buySuccess } = InternationalTip[lang];
            const { id, num, price } = this.buy_info;
            buyItemAlert(num, price, id).then(status => {
                if (status) {
                    buyItem(id, num, price).then(() => {
                        TipPop.tip(buySuccess);
                        this.close();
                    });
                }
            });
        });
        this.num_label.on(CLICK, this, () => {
            ctrlState.app.keyboard_number.enter(this.num_label.text, {
                close: (type: string, value: string) => {
                    if (type === 'confirm') {
                        this.setNum(Number(value));
                    }
                },
            });
        });
    }
    private setNum(num: number) {
        const { price } = this.buy_info;
        const lang = getLang();
        const { beyondBulletNum } = InternationalTip[lang];
        const user = getCurPlayer();
        if (num * price > user.bullet_num) {
            TipPop.tip(beyondBulletNum);
            num = Math.floor(user.bullet_num / price);
        }
        this.buy_info.num = num;
        this.num_label.text = num + '';
        this.setIntro();
    }
    private changeNum(operator: 'add' | 'minus') {
        const num_str = this.num_label.text;
        let num = Number(num_str);

        const len = num_str.length - 1;
        let ope_num = addZeroToNum(1, len);
        if (operator === 'minus' && ope_num === num) {
            ope_num = addZeroToNum(1, len - 1);
        }

        if (operator === 'add') {
            num = num + ope_num;
        } else {
            num = num - ope_num;
        }
        if (num < 1) {
            num = 1;
        }
        this.setNum(num);
    }
    private setIntro() {
        const lang = getLang();
        const { intro, buy_info } = this;
        const { purchase, buyBulletCost, bullet } = InternationalTip[lang];
        const { price, num } = buy_info;
        if (lang === 'en') {
            intro.text = `${buyBulletCost} ${purchase} ${
                price * num
            } ${bullet}`;
        } else {
            intro.text = `${buyBulletCost}${purchase}${price * num} ${bullet}`;
        }
    }
    private initLang(lang: Lang) {
        const { purchase } = InternationalTip[lang];
        const { title, btn_label } = this;

        title.text = purchase;
        btn_label.text = purchase;
        this.setIntro();
    }
    public buy(info: BuyInfo) {
        const { num_label, icon } = this;
        const { num, id } = info;

        const num_str = num + '';
        num_label.text = num_str;

        icon.skin = `image/pop/shop/icon/${id}.png`;
        this.buy_info = info;
        this.setIntro();
    }
    public destroy() {
        offLangChange(this);
        super.destroy();
    }
}

export function getSkillName(id: string) {
    const lang = getLang();
    const { bomb, lock, freeze } = InternationalTip[lang];

    switch (id) {
        case SkillMap.Bomb:
            return bomb;
        case SkillMap.Freezing:
            return freeze;
        case SkillMap.LockFish:
            return lock;
    }
}

export function buyItemAlert(num: number, price: number, id: string) {
    return new Promise((resolve, reject) => {
        const lang = getLang();
        const { bullet, buySuccess } = InternationalTip[lang];
        const { buyItemTip: buyTip } = InternationalTip[lang];
        const tip = buyTip
            .replace(`$1`, num * price + '')
            .replace(`$2`, bullet)
            .replace(`$3`, num + '')
            .replace(`$4`, getSkillName(id));

        AlertPop.alert(tip).then(type => {
            if (type === 'confirm') {
                resolve(true);
            } else {
                reject();
            }
        });
    });
}
export function buySkinAlert(price: number, name: string) {
    return new Promise((resolve, reject) => {
        const lang = getLang();
        const { bullet } = InternationalTip[lang];
        const { buySkinTip } = InternationalTip[lang];
        const tip = buySkinTip
            .replace(`$1`, price + '')
            .replace(`$2`, bullet)
            .replace(`$3`, name);

        AlertPop.alert(tip).then(type => {
            if (type === 'confirm') {
                resolve(true);
            } else {
                reject();
            }
        });
    });
}
