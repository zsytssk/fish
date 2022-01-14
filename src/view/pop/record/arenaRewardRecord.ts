import honor, { HonorDialog } from 'honor';
import { loadRes } from 'honor/utils/loadRes';
import { Label } from 'laya/ui/Label';

import { ArenaAwardListReq, ArenaAwardListResItem } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { formatDateTime, getMonthDateList } from '@app/utils/dayjsUtil';
import { tplIntr } from '@app/utils/utils';

import { arenaAwardList, arenaMatchList } from '../popSocket';
import { PaginationCtrl, PaginationEvent } from './paginationCtrl';
import { SelectCtrl } from './selectCtrl';

type SelectItem = {
    label: string;
    value: string | number;
};

type SelectMenuUI = ui.pop.record.itemMenuUI;
type SelectItemUI = ui.pop.record.selectItemBoxUI;

export default class ArenaRewardRecordPop
    extends ui.pop.record.arenaRewardRecordUI
    implements HonorDialog
{
    private select_ctrl1: SelectCtrl;
    private select_ctrl2: SelectCtrl;
    private pagination_ctrl: PaginationCtrl;
    private isInit = false;
    public static async preEnter() {
        const item_record = (await honor.director.openDialog(
            'pop/record/arenaRewardRecord.scene',
        )) as ArenaRewardRecordPop;
        AudioCtrl.play(AudioRes.PopShow);
        return item_record;
    }
    public static preLoad() {
        return loadRes('pop/record/arenaRewardRecord.scene');
    }
    public onAwake() {
        const {
            select_item2,
            select_item1,
            item_menu2,
            item_menu1,
            btn_search,
        } = this;

        onLangChange(this, () => {
            this.initLang();
        });

        const select_ctrl1 = new SelectCtrl(select_item1, item_menu1);
        select_ctrl1.setRender(this.renderSelectedItem1, this.renderMenuItem1);
        select_ctrl1.init();
        const itemList1 = [
            { label: tplIntr('arenaAwardDayRank'), value: 1 },
            { label: tplIntr('arenaAwardGradeRank'), value: 2 },
        ];
        select_ctrl1.setList(itemList1);
        select_ctrl1.setCurIndex(0);

        const select_ctrl2 = new SelectCtrl(select_item2, item_menu2);
        select_ctrl2.setRender(this.renderSelectedItem2, this.renderMenuItem2);
        select_ctrl2.init();

        const pagination_ctrl = new PaginationCtrl(this.pagination);
        pagination_ctrl.on(PaginationEvent.Change, (data: any) => {
            if (data.trigger_change) {
                this.search({
                    pageNum: data.cur + 1,
                    pageSize: data.page_size,
                });
            }
        });
        this.pagination_ctrl = pagination_ctrl;

        btn_search.on('click', null, () => {
            this.search({ pageNum: 1, pageSize: 10 });
        });
        setTimeout(() => {
            this.search({ pageNum: 1, pageSize: 10 });
        });

        this.select_ctrl1 = select_ctrl1;
        this.select_ctrl2 = select_ctrl2;
    }
    public onEnable() {
        if (!this.isInit) {
            this.isInit = true;
            return;
        }
        const { select_ctrl1, select_ctrl2 } = this;
        select_ctrl1.setCurIndex(0);
        select_ctrl2.setCurIndex(0);
    }
    private initLang() {
        const { title, title_box, btn_search_label, empty_tip } = this;

        title.text = tplIntr('arenaAwardTitle');
        empty_tip.text = tplIntr('noData');
        const arr = [
            tplIntr('arenaAwardItemTitle1'),
            tplIntr('arenaAwardItemTitle2'),
            tplIntr('arenaAwardItemTitle3'),
        ];
        for (let i = 0; i < title_box.numChildren; i++) {
            (title_box.getChildAt(i) as Label).text = arr[i];
        }
        btn_search_label.text = tplIntr('search');
    }
    private renderSelectedItem1 = async (
        box: SelectItemUI,
        data: SelectItem,
    ) => {
        const { item_name: item_name_label } = box;
        const { label, value } = data;
        item_name_label.text = label;

        let arr: any;
        if (value === 1) {
            const dayArr = getMonthDateList();
            arr = dayArr.map((item, _index) => {
                return {
                    label: item.format('MM/DD'),
                    value: item.valueOf(),
                };
            });
        } else {
            const gradeList = await arenaMatchList(1);
            arr = gradeList.map((item, _index) => {
                return {
                    label: tplIntr('arenaRewardTpl', { grade: item.id }),
                    value: item.id.valueOf(),
                };
            });
        }

        this.select_ctrl2.setList(arr);
        this.select_ctrl2.setCurIndex(0);
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

    private search({
        pageNum,
        pageSize,
    }: {
        pageNum: number;
        pageSize: number;
    }) {
        const { empty_tip, select_ctrl1, select_ctrl2, pagination_ctrl } = this;

        const type = select_ctrl1.getCurData()?.value || 1;
        const data = { type, pageNum, pageSize } as ArenaAwardListReq;
        const item_data = select_ctrl2.getCurData() || {};

        if (type === 1) {
            data.dayId = item_data.value;
        } else {
            data.matchId = item_data.value;
        }
        this.renderRecordList([]);
        arenaAwardList(data).then((data) => {
            empty_tip.visible = !data.list.length;
            this.renderRecordList(data.list);
            pagination_ctrl.update(data.total, data.pageSize);
        });
    }
    private renderRecordList(data: ArenaAwardListResItem[]) {
        const { record_list } = this;

        record_list.array = data.map((item) => {
            return {
                grade: item.ranking,
                time: formatDateTime(item.time),
                num: item.award + item.currency,
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
