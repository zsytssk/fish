import { onAccountChange } from 'ctrl/hall/hallCtrlUtil';
import honor, { HonorDialog } from 'honor';
import { afterActive } from 'honor/utils/tool';
import { AccountMap } from 'model/userInfo/userInfoModel';
import { ui } from 'ui/layaMaxUI';
import { getSkillName } from '../buyBullet';
import { PaginationCtrl, PaginationEvent } from './paginationCtrl';
import { SelectCtrl } from './selectCtrl';
import { getDateFromNow } from 'utils/utils';

type CoinData = {
    coin_icon: string;
    coin_name: string;
};
type SelectCoin = InstanceType<typeof GameRecord>['select_coin'];

type DateData = ReturnType<typeof getDateFromNow>;
type SelectItem = InstanceType<typeof GameRecord>['select_item'];

const DateList: DateData[] = [];
for (let i = -1; i >= -7; i--) {
    DateList.push(getDateFromNow(i));
}

export default class GameRecord extends ui.pop.record.gameRecordUI
    implements HonorDialog {
    public isModal = true;
    private select_coin_ctrl: SelectCtrl;
    private select_date_ctrl: SelectCtrl;
    private pagination_ctrl: PaginationCtrl;
    private all_list: GetItemListItemRep[];
    public static async preEnter() {
        const game_record = (await honor.director.openDialog(
            GameRecord,
        )) as GameRecord;
        return game_record;
    }
    public onAwake() {
        afterActive(this);
        const {
            select_item,
            select_coin,
            date_menu,
            coin_menu,
            btn_search,
        } = this;

        const select_coin_ctrl = new SelectCtrl(select_coin, coin_menu);
        select_coin_ctrl.setRender(this.renderSelectCoin);
        onAccountChange(this, (data: AccountMap) => {
            this.renderCoinMenu(data);
        });
        select_coin_ctrl.init();

        const select_item_ctrl = new SelectCtrl(select_item, date_menu);
        select_item_ctrl.setRender(this.renderSelectItem);
        select_item_ctrl.init();
        select_item_ctrl.setList(DateList);

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

        this.select_coin_ctrl = select_coin_ctrl;
        this.select_date_ctrl = select_item_ctrl;
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
    private search() {
        const {
            select_coin_ctrl,
            select_date_ctrl: select_item_ctrl,
            pagination_ctrl,
        } = this;
        const coin_data = select_coin_ctrl.getCurData();
        const date_data = select_item_ctrl.getCurData();
        console.log(coin_data, date_data);
        // pagination_ctrl.update(200, 20);
    }
    public setList(data: GetItemListItemRep[]) {
        this.all_list = data;
        this.pagination_ctrl.update(data.length, 9);
    }
    private renderRecordList(data: GetItemListItemRep[]) {
        const { record_list } = this;
        record_list.array = data.map(item => {
            return {
                buy_total: item.buyTotal,
                remain: item.remain,
                type: item.type,
                give_total: item.giveTotal,
                no: item.currency,
            };
        });
    }
    public destroy() {
        this.select_coin_ctrl.destroy();
        this.select_date_ctrl.destroy();
        this.select_coin_ctrl = undefined;
        this.select_date_ctrl = undefined;
        super.destroy();
    }
}
