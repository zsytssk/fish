import honor, { HonorDialog } from 'honor';
import { openDialog } from 'honor/ui/sceneManager';
import { loadRes } from 'honor/utils/loadRes';
import { Label } from 'laya/ui/Label';

import {
    offBindEvent,
    onAccountChange,
    onLangChange,
} from '@app/ctrl/hall/hallCtrlUtil';
import { AccountMap } from '@app/model/userInfo/userInfoModel';
import { ui } from '@app/ui/layaMaxUI';
import { tplIntr } from '@app/utils/utils';

import { getItemList } from '../popSocket';
import { getItemName } from '../shop';
import { PaginationCtrl, PaginationEvent } from './paginationCtrl';
import { SelectCtrl } from './selectCtrl';

type CoinData = {
    coin_icon: string;
    coin_name: string;
    coin_id: string;
};
type SelectCoin = InstanceType<typeof ItemRecord>['select_coin'];
type ItemData = {
    item_name: string;
    item_id: string;
};
type SelectItem = InstanceType<typeof ItemRecord>['select_item'];

export default class ItemRecord
    extends ui.pop.record.itemRecordUI
    implements HonorDialog
{
    public isModal = true;
    private select_coin_ctrl: SelectCtrl;
    private select_item_ctrl: SelectCtrl;
    private pagination_ctrl: PaginationCtrl;
    private all_list: GetItemListItemRep[];
    private isInit = false;
    public static async preEnter() {
        const item_record = await openDialog('pop/record/itemRecord.scene', {
            use_exist: true,
            stay_scene: true,
        });
        return item_record;
    }
    public static preLoad() {
        return loadRes('pop/record/itemRecord.scene');
    }
    public onAwake() {
        const { select_item, select_coin, item_menu, coin_menu, btn_search } =
            this;

        const select_coin_ctrl = new SelectCtrl(select_coin, coin_menu);
        select_coin_ctrl.setRender(this.renderSelectCoin);
        onAccountChange(this, (data: AccountMap) => {
            this.renderCoinMenu(data);
        });
        select_coin_ctrl.init();

        onLangChange(this, () => {
            this.initLang();
        });

        const select_item_ctrl = new SelectCtrl(select_item, item_menu);
        select_item_ctrl.setRender(this.renderSelectItem);
        select_item_ctrl.init();
        const ItemList = ['2001', '2002', '2003'].map((item) => {
            return { item_name: getItemName(item), item_id: item };
        });
        ItemList.unshift({ item_name: 'ALL', item_id: undefined });
        select_item_ctrl.setList(ItemList);
        select_item_ctrl.setCurIndex(0);

        const pagination_ctrl = new PaginationCtrl(this.pagination);
        pagination_ctrl.on(PaginationEvent.Change, ({ cur, range }) => {
            const { all_list } = this;
            const list: GetItemListItemRep[] = [];
            for (let i = range[0]; i < range[1]; i++) {
                list.push(all_list[i]);
            }
            this.renderRecordList(list);
        });
        this.pagination_ctrl = pagination_ctrl;

        btn_search.on('click', null, () => {
            this.search();
        });
        setTimeout(() => {
            this.search();
        });

        this.select_coin_ctrl = select_coin_ctrl;
        this.select_item_ctrl = select_item_ctrl;
    }
    public onEnable() {
        if (!this.isInit) {
            this.isInit = true;
            return;
        }
        const { select_coin_ctrl, select_item_ctrl } = this;
        select_coin_ctrl.setCurIndex(0);
        select_item_ctrl.setCurIndex(0);
        setTimeout(() => {
            this.search();
        });
    }
    private initLang() {
        const { title, title_box, btn_search_label, empty_tip } = this;

        title.text = tplIntr('itemListTitle');
        empty_tip.text = tplIntr('noData');
        const arr = [
            tplIntr('itemList1'),
            tplIntr('itemList2'),
            tplIntr('itemList3'),
            tplIntr('remainingNum'),
            tplIntr('gameNo'),
        ];
        for (let i = 0; i < title_box.numChildren; i++) {
            (title_box.getChildAt(i) as Label).text = arr[i];
        }
        btn_search_label.text = tplIntr('search');
    }
    private renderSelectCoin(box: SelectCoin, data: CoinData) {
        const { coin_icon, coin_name } = box;
        const { coin_icon: icon, coin_name: name } = data;
        if (icon) {
            coin_name.x = 43;
            coin_icon.visible = true;
            coin_icon.skin = icon;
        } else {
            coin_name.x = 15;
            coin_icon.visible = false;
        }

        coin_name.text = name;
    }
    private renderSelectItem(box: SelectItem, data: ItemData) {
        const { item_name: item_name_label } = box;
        const { item_name } = data;
        item_name_label.text = item_name;
    }
    private renderCoinMenu(data: AccountMap) {
        const { select_coin_ctrl } = this;
        const arr: CoinData[] = [];
        arr.push({
            coin_icon: '',
            coin_name: 'ALL',
            coin_id: undefined,
        });
        for (const [type, { icon }] of data) {
            arr.push({
                coin_icon: icon,
                coin_name: type,
                coin_id: type,
            });
        }
        select_coin_ctrl.setList(arr);
        select_coin_ctrl.setCurIndex(0);
    }
    private search() {
        const {
            empty_tip,
            select_coin_ctrl,
            select_item_ctrl,
            pagination_ctrl,
        } = this;

        const coin_data = select_coin_ctrl.getCurData() || {};
        const item_data = select_item_ctrl.getCurData() || {};
        const itemId = item_data.item_id;
        const currency = coin_data.coin_id;
        this.renderRecordList([]);
        getItemList({
            itemId,
            currency,
        }).then((data) => {
            this.all_list = data.list;
            empty_tip.visible = !data.list.length;
            pagination_ctrl.update(data.list.length, 10);
        });
    }
    public setList(data: GetItemListItemRep[]) {
        this.all_list = data;
        this.pagination_ctrl.update(data.length, 9);
    }
    private renderRecordList(data: GetItemListItemRep[]) {
        const { record_list } = this;

        record_list.array = data.map((item) => {
            return {
                buy_total: item.buyNum,
                remain: item.curNum,
                type: getItemName(item.itemId + ''),
                give_total: item.prizeNum,
                no: item.currency,
            };
        });
    }
    public destroy() {
        offBindEvent(this);
        this.select_coin_ctrl.destroy();
        this.select_item_ctrl.destroy();
        this.select_coin_ctrl = undefined;
        this.select_item_ctrl = undefined;
        super.destroy();
    }
}
