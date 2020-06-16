import {
    offBindEvent,
    onAccountChange,
    onLangChange,
} from 'ctrl/hall/hallCtrlUtil';
import {
    InternationalTip,
    Lang,
    InternationalTip,
} from 'data/internationalConfig';
import honor, { HonorDialog } from 'honor';
import { Label } from 'laya/ui/Label';
import { AccountMap } from 'model/userInfo/userInfoModel';
import { ui } from 'ui/layaMaxUI';
import { getDateFromNow } from 'utils/utils';
import { getBulletList } from '../popSocket';
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

export default class GameRecord extends ui.pop.record.gameRecordUI
    implements HonorDialog {
    public isModal = true;
    private select_coin_ctrl: SelectCtrl;
    private select_date_ctrl: SelectCtrl;
    private pagination_ctrl: PaginationCtrl;
    private all_list: GetItemListItemRep[];
    public static async preEnter() {
        const game_record = (await honor.director.openDialog({
            dialog: GameRecord,
            use_exist: true,
        })) as GameRecord;
        return game_record;
    }
    public onAwake() {
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

        btn_search.on('click', null, () => {
            this.pagination_ctrl.reset();
            this.search(1);
        });
        setTimeout(() => {
            this.search(1);
        });

        this.select_coin_ctrl = select_coin_ctrl;
        this.select_date_ctrl = select_date_ctrl;

        onLangChange(this, lang => {
            this.initLang(lang);
        });
    }
    private initLang(lang: Lang) {
        const { gameListTitle, search, prize, cost } = InternationalTip[lang];
        const { noData } = InternationalTip[lang];
        const { title, title_box, btn_search_label, empty_tip } = this;

        title.text = gameListTitle;
        const arr = [cost, prize];
        for (let i = 0; i < title_box.numChildren; i++) {
            (title_box.getChildAt(i) as Label).text = arr[i];
        }
        btn_search_label.text = search;
        empty_tip.text = noData;
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
    private search(pageNum = 1, all = false) {
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
            currency: all ? undefined : coin_data.coin_name,
            startTime: date_data.start,
            endTime: date_data.end,
            pageNum,
            pageSize,
        }).then(data => {
            pagination_ctrl.update(data.total, pageSize);
            this.renderRecordList(data.list);
            empty_tip.visible = !data.list.length;
        });
    }
    private renderRecordList(data: GetBulletItemRep[]) {
        const { record_list } = this;
        record_list.array = data.map(item => {
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
