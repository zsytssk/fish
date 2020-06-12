import {
    offBindEvent,
    onAccountChange,
    onLangChange,
} from 'ctrl/hall/hallCtrlUtil';
import {
    InternationalTipOther,
    Lang,
    InternationalTip,
} from 'data/internationalConfig';
import honor, { HonorDialog } from 'honor';
import { Label } from 'laya/ui/Label';
import { AccountMap } from 'model/userInfo/userInfoModel';
import { ui } from 'ui/layaMaxUI';
import { getSkillName } from '../buyBullet';
import { getItemList } from '../popSocket';
import { PaginationCtrl, PaginationEvent } from './paginationCtrl';
import { SelectCtrl } from './selectCtrl';

type CoinData = {
    coin_icon: string;
    coin_name: string;
};
type SelectCoin = InstanceType<typeof ItemRecord>['select_coin'];

type ItemData = {
    item_name: string;
    item_id: string;
};
type SelectItem = InstanceType<typeof ItemRecord>['select_item'];

export default class ItemRecord extends ui.pop.record.itemRecordUI
    implements HonorDialog {
    public isModal = true;
    private select_coin_ctrl: SelectCtrl;
    private select_item_ctrl: SelectCtrl;
    private pagination_ctrl: PaginationCtrl;
    private all_list: GetItemListItemRep[];
    public static async preEnter() {
        const item_record = (await honor.director.openDialog({
            dialog: ItemRecord,
            use_exist: true,
        })) as ItemRecord;
        return item_record;
    }
    public onAwake() {
        const {
            select_item,
            select_coin,
            item_menu,
            coin_menu,
            btn_search,
        } = this;

        const select_coin_ctrl = new SelectCtrl(select_coin, coin_menu);
        select_coin_ctrl.setRender(this.renderSelectCoin);
        onAccountChange(this, (data: AccountMap) => {
            this.renderCoinMenu(data);
        });
        select_coin_ctrl.init();

        onLangChange(this, lang => {
            this.initLang(lang);
        });

        const select_item_ctrl = new SelectCtrl(select_item, item_menu);
        select_item_ctrl.setRender(this.renderSelectItem);
        select_item_ctrl.init();
        const ItemList = ['2001', '2002', '2003'].map(item => {
            return { item_name: getSkillName(item), item_id: item };
        });
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
    private initLang(lang: Lang) {
        const {
            itemListTitle,
            search,
            itemList1,
            itemList2,
            itemList3,
            gameNo,
            remainingNum,
        } = InternationalTipOther[lang];
        const { noData } = InternationalTip[lang];
        const { title, title_box, btn_search_label, empty_tip } = this;

        title.text = itemListTitle;
        empty_tip.text = noData;
        const arr = [itemList1, itemList2, itemList3, remainingNum, gameNo];
        for (let i = 0; i < title_box.numChildren; i++) {
            (title_box.getChildAt(i) as Label).text = arr[i];
        }
        btn_search_label.text = search;
    }
    private renderSelectCoin(box: SelectCoin, data: CoinData) {
        const { coin_icon, coin_name } = box;
        const { coin_icon: icon, coin_name: name } = data;
        coin_icon.skin = icon;
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
        for (const [type, { icon }] of data) {
            arr.push({
                coin_icon: icon,
                coin_name: type,
            });
        }
        select_coin_ctrl.setList(arr);
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
        this.renderRecordList([]);
        getItemList({
            itemId: item_data.item_id,
            currency: coin_data.coin_name,
        }).then(data => {
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

        record_list.array = data.map(item => {
            return {
                buy_total: item.buyNum,
                remain: item.curNum,
                type: getSkillName(item.itemId),
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
