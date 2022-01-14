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
import { onNode } from '@app/utils/layaUtils';
import { getDateFromNow, tplIntr } from '@app/utils/utils';

import { getBulletList, getRecentBullet } from '../popSocket';
import { PaginationCtrl, PaginationEvent } from './paginationCtrl';
import { SelectCtrl } from './selectCtrl';

type CoinData = {
    coin_icon: string;
    coin_name: string;
};
type SelectCoin = InstanceType<typeof GameRecord>['select_coin'];
type DateData = ReturnType<typeof getDateFromNow>;
type SelectItem = InstanceType<typeof GameRecord>['select_item'];

const DateList: DateData[] = [];
for (let i = 0; i >= -7; i--) {
    DateList.push(getDateFromNow(i));
}

export default class GameRecord
    extends ui.pop.record.gameRecordUI
    implements HonorDialog
{
    private select_coin_ctrl: SelectCtrl;
    private select_date_ctrl: SelectCtrl;
    private pagination_ctrl: PaginationCtrl;
    public static async preEnter() {
        const game_record = await openDialog('pop/record/gameRecord.scene');
        return game_record;
    }
    public static preLoad() {
        return loadRes('pop/record/gameRecord.scene');
    }
    public onAwake() {
        const {
            select_item,
            select_coin,
            date_menu,
            coin_menu,
            btn_search,
            record_list,
        } = this;

        record_list.array = [];
        const select_coin_ctrl = new SelectCtrl(select_coin, coin_menu);
        select_coin_ctrl.setRender(this.renderSelectCoin);
        onAccountChange(this, (data: AccountMap) => {
            this.renderCoinMenu(data);
        });
        select_coin_ctrl.init();

        const select_date_ctrl = new SelectCtrl(select_item, date_menu);
        select_date_ctrl.setRender(this.renderSelectItem);
        select_date_ctrl.init();
        select_date_ctrl.setList(DateList);
        select_date_ctrl.setCurIndex(0);

        const pagination_ctrl = new PaginationCtrl(this.pagination);
        pagination_ctrl.on(
            PaginationEvent.Change,
            ({ cur, trigger_change }) => {
                if (trigger_change) {
                    this.search(cur + 1);
                }
            },
        );
        this.pagination_ctrl = pagination_ctrl;

        onNode(btn_search, 'click', () => {
            this.pagination_ctrl.reset();
            this.search(1);
        });

        this.select_coin_ctrl = select_coin_ctrl;
        this.select_date_ctrl = select_date_ctrl;

        onLangChange(this, () => {
            this.initLang();
        });
    }
    public onEnable() {
        const { select_coin_ctrl, select_date_ctrl } = this;
        getRecentBullet().then((data) => {
            const coin_list = select_coin_ctrl.getList() as CoinData[];
            const date_list = select_date_ctrl.getList() as DateData[];
            let coin_index = coin_list.findIndex((item) => {
                return item.coin_name === data.currency;
            });
            let date_index = date_list.findIndex((item) => {
                return item.start < data.time && item.end > data.time;
            });
            if (coin_index === -1) {
                coin_index = 0;
            }
            if (date_index === -1) {
                date_index = 0;
            }
            select_coin_ctrl.setCurIndex(coin_index);
            select_date_ctrl.setCurIndex(date_index);

            this.search(1);
        });
    }
    private initLang() {
        const { title, title_box, btn_search_label, empty_tip } = this;

        title.text = tplIntr('gameListTitle');
        const arr = [tplIntr('cost'), tplIntr('prize')];
        for (let i = 0; i < title_box.numChildren; i++) {
            (title_box.getChildAt(i) as Label).text = arr[i];
        }
        btn_search_label.text = tplIntr('search');
        empty_tip.text = tplIntr('noData');
    }
    private renderSelectCoin(box: SelectCoin, data: CoinData) {
        const { coin_icon, coin_name } = box;
        const { coin_icon: icon, coin_name: name } = data;
        coin_icon.skin = icon;
        coin_name.text = name;
    }
    private renderSelectItem(box: SelectItem, data: DateData) {
        const { item_name: item_name_label } = box;
        const { date_str } = data;
        item_name_label.text = date_str;
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
    private search(pageNum = 1) {
        const {
            select_coin_ctrl,
            select_date_ctrl,
            pagination_ctrl,
            empty_tip,
        } = this;
        const coin_data = select_coin_ctrl.getCurData() || {};
        const date_data = select_date_ctrl.getCurData() || {};

        this.renderRecordList([]);
        const pageSize = 10;
        getBulletList({
            currency: coin_data.coin_name,
            startTime: date_data.start,
            endTime: date_data.end,
            pageNum,
            pageSize,
        }).then((data) => {
            pagination_ctrl.update(data.total, pageSize);
            this.renderRecordList(data.list);
            empty_tip.visible = !data.list.length;
        });
    }
    private renderRecordList(data: GetBulletItemRep[]) {
        const { record_list } = this;
        record_list.array = data.map((item) => {
            return {
                prize: item.prize ? `${item.prize}  ${item.currency}` : 0,
                cost: item.cost ? `${item.cost}  ${item.currency}` : 0,
            };
        });
    }
    public destroy() {
        offBindEvent(this);
        this.select_coin_ctrl.destroy();
        this.select_date_ctrl.destroy();
        this.select_coin_ctrl = undefined;
        this.select_date_ctrl = undefined;
        super.destroy();
    }
}
