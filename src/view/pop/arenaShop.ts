import honor, { HonorDialog } from 'honor';
import { loadRes } from 'honor/utils/loadRes';
import { Event } from 'laya/events/Event';
import { Button } from 'laya/ui/Button';
import { Label } from 'laya/ui/Label';
import { Handler } from 'laya/utils/Handler';

import { ShopListDataItem } from '@app/api/arenaApi';
import { isTrial } from '@app/ctrl/ctrlState';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { offLangChange, onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { login } from '@app/ctrl/hall/login';
import { AudioRes } from '@app/data/audioRes';
import { Lang } from '@app/data/internationalConfig';
import { ui } from '@app/ui/layaMaxUI';
import { covertLang, tplIntr } from '@app/utils/utils';

import { buySkinAlert } from './buyBullet';
import {
    arenaBuyItem,
    ArenaShopList,
    arenaShopList,
    arenaUseGunSkin,
} from './popSocket';
import { getItemName, GunSkinStatus } from './shop';

export type ArenaShopPopInfo = {
    modeId: number;
    currency: string;
};
type ShopGunItemUI = ui.pop.shop.shopGunItemUI;
/** 商城弹出层 */
export default class ArenaShopPop
    extends ui.pop.shop.arenaShopUI
    implements HonorDialog
{
    /** 是否初始化... */
    public static async preEnter(param: ArenaShopPopInfo) {
        const shop_dialog = await honor.director.openDialog<ArenaShopPop>(
            'pop/shop/arenaShop.scene',
        );
        AudioCtrl.play(AudioRes.PopShow);
        arenaShopList(param).then((data) => {
            shop_dialog.initData(data);
        });
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
        const { title, skin_tag } = this;
        const ani_name = covertLang(lang);
        skin_tag.text = tplIntr('skin');
        title.skin = `image/international/title_shop_${ani_name}.png`;
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
    public initData(data: ArenaShopList) {
        const { gun_list } = this;
        const { gun } = data;

        gun_list.array = gun;
    }
    private renderGunList = (box: ShopGunItemUI, index: number) => {
        const { itemName, itemId, status, price, id, currency } = this.gun_list
            .array[index] as ShopListDataItem;
        const { name_label, icon, stack_btn, icon_check, select_bd } = box;

        const gun_name = getItemName(itemId, itemName);
        name_label.text = gun_name;
        icon.skin = `image/pop/shop/icon/${itemId}.png`;
        const status_index = status;
        stack_btn.selectedIndex = status_index;
        const cur_btn = stack_btn.getChildAt(status_index) as Button;
        const cur_label = cur_btn.getChildByName('label') as Label;

        icon_check.visible = false;
        select_bd.visible = false;
        cur_btn.offAll();

        if (status === GunSkinStatus.NoHave) {
            cur_label.text = `${price}${currency}`;
            cur_btn.on(Event.CLICK, cur_btn, () => {
                if (isTrial()) {
                    login();
                    return;
                }
                buySkinAlert(price, gun_name, currency).then((_status) => {
                    if (!_status) {
                        return;
                    }
                    arenaBuyItem(id, itemId, 1)
                        .then(() => {
                            this.buyGunSkin(itemId);
                        })
                        .catch(() => {
                            this.close();
                        });
                });
            });
        } else if (status === GunSkinStatus.Have) {
            cur_label.text = tplIntr('use');
            cur_btn.on(Event.CLICK, cur_btn, () => {
                arenaUseGunSkin(itemId).then(() => {
                    this.useGunSkin(itemId);
                });
            });
        } else if (status === GunSkinStatus.Used) {
            cur_label.text = tplIntr('inUse');
            icon_check.visible = true;
            select_bd.visible = true;
        }
        const width = cur_label.width + 30;
        cur_btn.width = width > 143 ? width : 143;
        // 触发重新渲染来定位
        cur_label.centerX = cur_label.centerX === 0 ? -1 : 0;
    };
    /** 购买皮肤 */
    public buyGunSkin(itemId: string) {
        // this.gun_list.changeItem();
        const arr = this.gun_list.array as ShopListDataItem[];
        for (const item of arr) {
            if (item.itemId === itemId) {
                item.status = GunSkinStatus.Have;
                break;
            }
        }
        this.gun_list.refresh();
    }
    /** 使用皮肤 */
    public useGunSkin(itemId: string) {
        const arr = this.gun_list.array as ShopListDataItem[];
        for (const item of arr) {
            if (item.itemId === itemId) {
                item.status = GunSkinStatus.Used;
            } else if (item.status !== GunSkinStatus.NoHave) {
                item.status = GunSkinStatus.Have;
            }
        }
        this.gun_list.refresh();
    }

    public destroy() {
        offLangChange(this);
        super.destroy();
    }
}
