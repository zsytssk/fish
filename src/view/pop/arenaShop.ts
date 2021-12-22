import honor, { HonorDialog } from 'honor';
import { loaderManager } from 'honor/state';
import { Event } from 'laya/events/Event';
import { Handler } from 'laya/utils/Handler';

import { ShopListData } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import {
    getLang,
    offLangChange,
    onLangChange,
} from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { InternationalTip, Lang } from '@app/data/internationalConfig';
import { ui } from '@app/ui/layaMaxUI';

import BuyBulletPop from './buyBullet';
import { arenaShopList } from './popSocket';

/** item 渲染数据 */
type ItemRenderData = {
    item_name: string;
    item_id: string;
    item_price: number;
    item_num: number;
    currency: string;
};

type ShopItemItemUI = ui.pop.shop.shopItemItem1UI;

/** 商城弹出层 */
export default class ArenaShopPop
    extends ui.pop.shop.arenaShopUI
    implements HonorDialog
{
    public isModal = true;
    /** 是否初始化... */
    private is_init = false;
    public static preEnter() {
        AudioCtrl.play(AudioRes.PopShow);
        const shop_dialog = honor.director.openDialog({
            dialog: ArenaShopPop,
            use_exist: true,
            stay_scene: true,
        }) as Promise<ArenaShopPop>;
        const shop_data = arenaShopList();
        // return Promise.all([shop_dialog, shop_data]).then(([dialog, data]) => {
        //     dialog.initData(data);

        //     return dialog;
        // });
        return shop_dialog;
    }
    public static preLoad() {
        return loaderManager.preLoad('Dialog', 'pop/shop/shop.scene');
    }
    public init() {
        const { item_list } = this;

        item_list.array = [];

        item_list.renderHandler = new Handler(
            item_list,
            this.renderItemList,
            null,
            false,
        );
    }
    public onEnable() {
        if (!this.is_init) {
            this.init();
        }
        this.is_init = true;
    }
    public initData(data: ShopListData) {
        const { item_list } = this;

        const item_arr = [] as ItemRenderData[];
        for (const item_item of data) {
            const {
                goodsName: name,
                goodsId: item_id,
                price: item_price,
                num: item_num,
                currency,
            } = item_item;

            const item_name = getItemName(item_id, name);
            item_arr.push({
                item_name,
                item_id,
                item_price,
                item_num,
                currency,
            });
        }
        console.log(`test:>`, item_arr);
        item_list.array = item_arr;
    }

    private renderItemList = (box: ShopItemItemUI, index: number) => {
        const { item_name, item_id, item_num, item_price, currency } = this
            .item_list.array[index] as ItemRenderData;
        const { name_label, icon, num_label, price_label, btn_buy } = box;
        name_label.text = item_name;
        num_label.text = item_num + '';
        icon.skin = `image/pop/shop/icon/${item_id}.png`;
        price_label.text = item_price + currency;
        btn_buy.offAll();
        btn_buy.on(Event.CLICK, btn_buy, () => {
            BuyBulletPop.preEnter({
                type: item_name,
                id: item_id,
                num: item_num,
                price: item_price,
            });
        });
    }; // tslint:disable-line
    public onAwake() {
        onLangChange(this, (lang) => {
            this.initLang(lang);
        });
    }
    private initLang(lang: Lang) {
        const { title } = this;

        title.skin = `image/international/title_shop_${lang}.png`;
    }
    public destroy() {
        offLangChange(this);
        super.destroy();
    }
}

function getItemName(id: string, name: string) {
    const lang = getLang();
    const { skin, bomb, freeze, lock } = InternationalTip[lang];
    let suffer_prefix = '';
    if (name.indexOf('皮肤') !== -1) {
        suffer_prefix = name.replace('皮肤', '');
    }
    let item_name = '';
    if (id === '2001') {
        item_name = lock;
    } else if (id === '2002') {
        item_name = freeze;
    } else if (id === '2003') {
        item_name = bomb;
    } else {
        item_name = skin;
    }

    return item_name + suffer_prefix;
}
