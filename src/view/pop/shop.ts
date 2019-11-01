import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';

enum GunSkinStatus {
    NoHave = 0,
    Have = 1,
    Used = 2,
}
type GunData = {
    name: string;
    id: string;
    status: GunSkinStatus;
    price: number;
};
type ItemData = { name: string; id: string; price: number; num: number };

type ShopGunItemUI = ui.pop.shop.shopGunItemUI;
type ShopItemItemUI = ui.pop.shop.shopItemItemUI;

type GunRenderData = {
    gun_name: string;
    gun_id: string;
    gun_status: number;
    gun_price: number;
};

type ItemRenderData = {
    item_name: string;
    item_id: string;
    item_price: number;
    item_num: number;
};

/** 商城弹出层 */
export default class ShopPop extends ui.pop.shop.shopUI implements HonorDialog {
    public isModal = true;
    /** 是否初始化... */
    private is_init = false;
    public static preEnter() {
        honor.director.openDialog(ShopPop);
    }
    public init() {
        const { gun_list, item_list } = this;
        gun_list.array = [];
        item_list.array = [];
        gun_list.renderHandler = new Laya.Handler(
            gun_list,
            this.renderGunList,
            null,
            false,
        );
        item_list.renderHandler = new Laya.Handler(
            item_list,
            this.renderItemList,
            null,
            false,
        );
        console.log('EmptyScene enable');
    }
    public onMounted() {
        if (!this.is_init) {
            this.init();
        }
        this.is_init = true;
    }
    public initData(data: { gun: GunData[]; item: ItemData[] }) {
        const { gun_list, item_list } = this;
        const { gun, item } = data;

        const gun_arr = [] as GunRenderData[];
        for (const gun_item of gun) {
            const {
                name: gun_name,
                id: gun_id,
                status: gun_status,
                price: gun_price,
            } = gun_item;

            gun_arr.push({
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
                name: item_name,
                id: item_id,
                price: item_price,
                num: item_num,
            } = item_item;

            item_arr.push({
                item_name,
                item_id,
                item_price,
                item_num,
            });
        }
        item_list.array = item_arr;
    }
    private renderGunList = (box: ShopGunItemUI, index: number) => {
        const { gun_name, gun_id, gun_status, gun_price } = this.gun_list.array[
            index
        ] as GunRenderData;
        const { name_label, icon, stack_btn } = box;
        name_label.text = gun_name;
        icon.skin = `image/pop/shop/icon/gun${gun_id}.png`;
        stack_btn.selectedIndex = gun_status;
        const cur_btn = stack_btn.getChildAt(gun_status) as Laya.Button;
        const cur_label = cur_btn.getChildByName('label') as Laya.Label;
        cur_btn.offAll();
        if (gun_status === GunSkinStatus.NoHave) {
            cur_label.text = gun_price + '';
            cur_btn.on(Laya.Event.CLICK, cur_btn, () => {
                console.log(`btn`, gun_status);
            });
        } else if (gun_status === GunSkinStatus.Have) {
            cur_btn.on(Laya.Event.CLICK, cur_btn, () => {
                this.useGunSkin(gun_id);
            });
        } else if (gun_status === GunSkinStatus.Used) {
            cur_btn.on(Laya.Event.CLICK, cur_btn, () => {
                console.log(`btn`, gun_status);
            });
        }
    }; // tslint:disable-line
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
    public buyItem() {}
    private renderItemList = (box: ShopItemItemUI, index: number) => {
        const { item_name, item_id, item_num, item_price } = this.item_list
            .array[index] as ItemRenderData;
        const { name_label, icon, num_label, price_label, btn_buy } = box;
        name_label.text = item_name;
        num_label.text = item_num + '';
        icon.skin = `image/pop/shop/icon/item_${item_id}.png`;
        price_label.text = item_price + '';
        btn_buy.offAll();
        btn_buy.on(Laya.Event.CLICK, btn_buy, () => {
            console.log(`buy ${item_id}`);
        });
    }; // tslint:disable-line
}
