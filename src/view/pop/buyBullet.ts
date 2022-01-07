import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';

import { ctrlState } from '@app/ctrl/ctrlState';
import {
    getLang,
    offLangChange,
    onLangChange,
} from '@app/ctrl/hall/hallCtrlUtil';
import { getCurPlayer } from '@app/model/modelState';
import { ui } from '@app/ui/layaMaxUI';
import { addZeroToNum, tplIntr } from '@app/utils/utils';

import AlertPop from './alert';
import { getItemName } from './shop';
import TipPop from './tip';

type BuyInfo = {
    type: string;
    id: string;
    num: number;
    price: number;
    currency?: string;
};

export type BuyResultData = {
    id: string;
    num: number;
    price: number;
};
export default class BuyBulletPop
    extends ui.pop.alert.buyBulletUI
    implements HonorDialog
{
    public isModal = true;
    private buy_info: BuyInfo;
    private resolve: (info: BuyResultData) => void;
    public static async preEnter(info: BuyInfo): Promise<BuyResultData> {
        const dialog = (await honor.director.openDialog({
            dialog: BuyBulletPop,
            use_exist: true,
            stay_scene: true,
        })) as BuyBulletPop;
        return dialog.buy(info);
    }
    public onAwake() {
        onLangChange(this, (lang) => {
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
            const { id, num, price } = this.buy_info;
            buyItemAlert(num, price, id).then((status) => {
                if (status) {
                    this.resolve({ id, num, price });
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
                nullMsg: tplIntr('keyboardEmpTip'),
                delTxt: tplIntr('Delete'),
                confirmTxt: tplIntr('confirm'),
            });
        });
    }
    private setNum(num: number) {
        const { price } = this.buy_info;
        const user = getCurPlayer();
        if (num * price > user.bullet_num) {
            TipPop.tip(tplIntr('beyondBulletNum'));
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
        const { price, num, currency } = buy_info;

        const typename = currency || tplIntr('bullet');
        const cost = price * num;
        if (lang === 'en') {
            intro.text = `${tplIntr('buyBulletCost')} ${cost} ${typename}`;
        } else {
            intro.text = `${tplIntr('buyBulletCost')}${cost}${typename}`;
        }
    }
    private initLang() {
        const { title, btn_label } = this;

        btn_label.text = title.text = tplIntr('purchase');
        this.setIntro();
    }
    public buy(info: BuyInfo) {
        return new Promise<BuyResultData>((resolve, _reject) => {
            const { num_label, icon } = this;
            const { num, id } = info;

            const num_str = num + '';
            num_label.text = num_str;

            icon.skin = `image/pop/shop/icon/${id}.png`;
            this.buy_info = info;
            this.setIntro();
            this.resolve = resolve;
        });
    }
    public destroy() {
        offLangChange(this);
        super.destroy();
    }
}

export function buyItemAlert(num: number, price: number, id: string) {
    return new Promise((resolve, reject) => {
        const tip = tplIntr('buyItemTip', {
            cost_num: num * price,
            cost_name: tplIntr('bullet'),
            num: num,
            name: getItemName(id + ''),
        });

        AlertPop.alert(tip).then((type) => {
            if (type === 'confirm') {
                resolve(true);
            } else {
                reject();
            }
        });
    });
}
export function buySkinAlert(num: number, item: string, name?: string) {
    return new Promise((resolve, reject) => {
        name = name || tplIntr('bullet');
        const tip = tplIntr('buySkinTip', {
            num,
            name,
            item,
        });

        AlertPop.alert(tip).then((type) => {
            if (type === 'confirm') {
                resolve(true);
            } else {
                reject();
            }
        });
    });
}
