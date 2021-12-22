import honor, { HonorDialog } from 'honor';
import { loadRes } from 'honor/utils/loadRes';
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

import { buySkinAlert } from './buyBullet';
import { arenaBuyItem, arenaShopList, arenaUseGunSkin } from './popSocket';
import { getItemName, GunRenderData, GunSkinStatus, ShopData } from './shop';

type ShopGunItemUI = ui.pop.shop.shopGunItemUI;
/** 商城弹出层 */
export default class ArenaShopPop
    extends ui.pop.shop.arenaShopUI
    implements HonorDialog
{
    public isModal = true;
    /** 是否初始化... */
    public static async preEnter() {
        AudioCtrl.play(AudioRes.PopShow);
        const shop_dialog = (await honor.director.openDialog({
            dialog: ArenaShopPop,
            use_exist: true,
            stay_scene: true,
        })) as Promise<ArenaShopPop>;

        return shop_dialog;
    }
    public static preLoad() {
        return loadRes('pop/shop/shop.scene');
    }
    // tslint:disable-line
    public onAwake() {
        this.init();
        onLangChange(this, (lang) => {
            this.initLang(lang);
        });
    }
    private initLang(lang: Lang) {
        const { title } = this;

        title.skin = `image/international/title_shop_${lang}.png`;
    }
    public init() {
        const { gun_list } = this;

        gun_list.array = [];
        gun_list.renderHandler = new Handler(
            gun_list,
            this.renderGunList,
            null,
            false,
        );
    }
    public onEnable() {
        arenaShopList().then((data) => {
            this.initData(data);
        });
    }
    public initData(data: ShopData) {
        const { gun_list } = this;
        const { gun } = data;

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

    public destroy() {
        offLangChange(this);
        super.destroy();
    }
}
