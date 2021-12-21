import honor, { HonorDialog } from 'honor';
import { loaderManager } from 'honor/state';
import { Label } from 'laya/ui/Label';

import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { InternationalTip, Lang } from '@app/data/internationalConfig';
import { ui } from '@app/ui/layaMaxUI';
import { getMonthDateList } from '@app/utils/dayjsUtil';

import { getSkillName } from '../buyBullet';
import { getItemList } from '../popSocket';
import { PaginationCtrl, PaginationEvent } from './paginationCtrl';
import { SelectCtrl } from './selectCtrl';

type SelectItem = {
    label: string;
    value: string;
};

type SelectMenuUI = ui.pop.record.itemMenuUI;
type SelectItemUI = ui.pop.record.selectItemBoxUI;

export default class ArenaRewardRecordPop
    extends ui.pop.record.arenaRewardRecordUI
    implements HonorDialog
{
    public isModal = true;
    private select_ctrl1: SelectCtrl;
    private select_ctrl2: SelectCtrl;
    private pagination_ctrl: PaginationCtrl;
    private all_list: GetItemListItemRep[];
    private isInit = false;
    public static async preEnter() {
        const item_record = (await honor.director.openDialog({
            dialog: ArenaRewardRecordPop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaRewardRecordPop;
        return item_record;
    }
    public static preLoad() {
        return loaderManager.preLoad('Dialog', 'pop/record/itemRecord.scene');
    }
    public onAwake() {
        const {
            select_item2,
            select_item1,
            item_menu2,
            item_menu1,
            btn_search,
        } = this;

        onLangChange(this, (lang) => {
            this.initLang(lang);
        });

        const select_ctrl1 = new SelectCtrl(select_item1, item_menu1);
        select_ctrl1.setRender(this.renderSelectedItem1, this.renderMenuItem1);
        select_ctrl1.init();
        const itemList1 = [
            { label: '日排行奖励', value: 'date' },
            { label: '每期总排行奖励', value: 'grade' },
        ];
        select_ctrl1.setList(itemList1);
        select_ctrl1.setCurIndex(0);

        const select_ctrl2 = new SelectCtrl(select_item2, item_menu2);
        select_ctrl2.setRender(this.renderSelectedItem2, this.renderMenuItem2);
        select_ctrl2.init();

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

        this.select_ctrl1 = select_ctrl1;
        this.select_ctrl2 = select_ctrl2;
    }
    public onEnable() {
        if (!this.isInit) {
            this.isInit = true;
            return;
        }
        const {
            select_ctrl1: select_coin_ctrl,
            select_ctrl2: select_item_ctrl,
        } = this;
        select_coin_ctrl.setCurIndex(0);
        select_item_ctrl.setCurIndex(0);
        setTimeout(() => {
            this.search();
        });
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
        } = InternationalTip[lang];
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
    private renderSelectedItem1 = (box: SelectItemUI, data: SelectItem) => {
        const { item_name: item_name_label } = box;
        const { label, value } = data;
        item_name_label.text = label;

        const dayArr = getMonthDateList();
        const arr = dayArr.map((item, index) => {
            if (value === 'date') {
                return {
                    label: item.format('MM/DD'),
                    value: item.valueOf(),
                };
            } else {
                return {
                    label: `第${index + 1}期`,
                    value: item.valueOf(),
                };
            }
        });
        console.log(`test:>`, arr);
        this.select_ctrl2.setList(arr);
        this.select_ctrl2.setCurIndex(0);
        // @TODO-需要切换select_ctrl2的数据
    };
    private renderSelectedItem2(box: SelectItemUI, data: SelectItem) {
        const { item_name: item_name_label } = box;
        const { label } = data;
        item_name_label.text = label;
    }
    private renderMenuItem1 = (box: SelectItemUI, index: number) => {
        if (!this.select_ctrl1?.array) {
            return;
        }
        const item_name_label = box.getChildByName('item_name') as Label;
        const data = this.select_ctrl1.array[index];
        const { label } = data;
        item_name_label.text = label;
    };
    private renderMenuItem2 = (box: SelectItemUI, index: number) => {
        if (!this.select_ctrl2?.array) {
            return;
        }
        const item_name_label = box.getChildByName('item_name') as Label;
        const { label } = this.select_ctrl2.array[index];
        item_name_label.text = label;
    };

    private search() {
        const {
            empty_tip,
            select_ctrl1: select_coin_ctrl,
            select_ctrl2: select_item_ctrl,
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
                type: getSkillName(item.itemId + ''),
                give_total: item.prizeNum,
                no: item.currency,
            };
        });
    }
    public destroy() {
        this.select_ctrl1.destroy();
        this.select_ctrl2.destroy();
        this.select_ctrl1 = undefined;
        this.select_ctrl2 = undefined;
        super.destroy();
    }
}
