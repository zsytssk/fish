import honor, { HonorDialog } from 'honor';
import { loaderManager } from 'honor/state';
import { Event } from 'laya/events/Event';
import { Button } from 'laya/ui/Button';
import { Label } from 'laya/ui/Label';
import { Handler } from 'laya/utils/Handler';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import {
    getLang,
    offLangChange,
    onLangChange,
} from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { InternationalTip, Lang } from '@app/data/internationalConfig';
import { ui } from '@app/ui/layaMaxUI';
import { tplStr } from '@app/utils/utils';

import BuyBulletPop, { buySkinAlert } from './buyBullet';
import { arenaBuyItem, arenaUseGunSkin, buyItem } from './popSocket';
import { getItemName, GunRenderData, GunSkinStatus, ShopData } from './shop';
import TipPop from './tip';

/** item 渲染数据 */
type ItemRenderData = {
    item_name: string;
    item_id: string;
    item_price: number;
    item_num: number;
    currency: string;
};

type ShopItemItemUI = ui.pop.shop.shopItemItem1UI;
type ShopGunItemUI = ui.pop.shop.shopGunItemUI;
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
        // const shop_data = arenaShopList();
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
        const { item_list, gun_list } = this;

        item_list.array = [];

        item_list.renderHandler = new Handler(
            item_list,
            this.renderItemList,
            null,
            false,
        );

        gun_list.array = [];
        gun_list.renderHandler = new Handler(
            item_list,
            this.renderGunList,
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
    public initData(data: ShopData) {
        const { item_list, gun_list } = this;
        const { gun, item } = data;

        const gun_arr = [] as GunRenderData[];
        for (const gun_item of gun) {
            const {
                name,
                id: gun_id,
                status: gun_status,
                price: gun_price,
                currency,
            } = gun_item;

            const gun_name = getItemName(gun_id, name);

            gun_arr.push({
                currency,
                gun_name,
                gun_id,
                gun_status,
                gun_price,
            });
        }
        gun_list.array = gun_arr;

        const item_arr = [] as ItemRenderData[];
        for (const item_item of item) {
            const {
                name,
                id: item_id,
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
        item_list.array = item_arr;
    }
    private renderGunList = (box: ShopGunItemUI, index: number) => {
        const { gun_name, gun_id, gun_status, gun_price, currency } = this
            .gun_list.array[index] as GunRenderData;
        const { name_label, icon, stack_btn, icon_check, select_bd } = box;
        const lang = getLang();
        const { use, inUse } = InternationalTip[lang];

        name_label.text = gun_name;
        icon.skin = `image/pop/shop/icon/${gun_id}.png`;
        const status_index = gun_status;
        stack_btn.selectedIndex = status_index;
        const cur_btn = stack_btn.getChildAt(status_index) as Button;
        const cur_label = cur_btn.getChildByName('label') as Label;

        icon_check.visible = false;
        select_bd.visible = false;
        cur_btn.offAll();

        if (gun_status === GunSkinStatus.NoHave) {
            cur_label.text = `${gun_price}${currency}`;
            cur_btn.on(Event.CLICK, cur_btn, () => {
                buySkinAlert(gun_price, gun_name).then((_status) => {
                    if (!_status) {
                        return;
                    }
                    arenaBuyItem(gun_id, 1).then(() => {
                        this.buyGunSkin(gun_id);
                    });
                });
            });
        } else if (gun_status === GunSkinStatus.Have) {
            cur_label.text = use;
            cur_btn.on(Event.CLICK, cur_btn, () => {
                arenaUseGunSkin(gun_id).then(() => {
                    this.useGunSkin(gun_id);
                });
            });
        } else if (gun_status === GunSkinStatus.Used) {
            cur_label.text = inUse;
            icon_check.visible = true;
            select_bd.visible = true;
        }
    };
    /** 购买皮肤 */
    public buyGunSkin(id: string) {
        // this.gun_list.changeItem();
        const arr = this.gun_list.array as GunRenderData[];
        for (const item of arr) {
            if (item.gun_id === id) {
                item.gun_status = GunSkinStatus.Have;
                break;
            }
        }
        this.gun_list.refresh();
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
                currency,
            }).then((data) => {
                arenaBuyItem(data.id, data.num).then(() => {
                    TipPop.tip(tplStr('buySuccess'));
                    this.close();
                });
            });
        });
    };
    /** 使用皮肤 */
    public useGunSkin(id: string) {
        const arr = this.gun_list.array as GunRenderData[];
        for (const item of arr) {
            if (item.gun_id === id) {
                item.gun_status = GunSkinStatus.Used;
            } else if (item.gun_status !== GunSkinStatus.NoHave) {
                item.gun_status = GunSkinStatus.Have;
            }
        }
        this.gun_list.refresh();
    }
    // tslint:disable-line
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
