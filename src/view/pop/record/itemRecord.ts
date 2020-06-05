import { ui } from 'ui/layaMaxUI';
import honor, { HonorDialog } from 'honor';
import { onAccountChange } from 'ctrl/hall/hallCtrlUtil';
import { AccountMap } from 'model/userInfo/userInfoModel';
import { Handler } from 'laya/utils/Handler';
import { SelectCtrl } from './selectCtrl';
import { Sprite } from 'laya/display/Sprite';
import { afterActive } from 'honor/utils/tool';
import { getSkillName } from '../buyBullet';

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

const ItemList = ['2001', '2002', '2003'];

export default class ItemRecord extends ui.pop.record.itemRecordUI
    implements HonorDialog {
    public isModal = true;
    private select_coin_ctrl: SelectCtrl;
    private select_item_ctrl: SelectCtrl;
    public static async preEnter() {
        const item_record = (await honor.director.openDialog(
            ItemRecord,
        )) as ItemRecord;
    }
    public onAwake() {
        afterActive(this);
        const { select_item, select_coin, item_menu, coin_menu } = this;

        const select_coin_ctrl = new SelectCtrl(select_coin, coin_menu);
        select_coin_ctrl.setRender(this.renderSelectCoin);
        onAccountChange(this, (data: AccountMap) => {
            this.renderCoinMenu(data);
        });
        select_coin_ctrl.init();

        const item_list = ItemList.map(item => {
            return { item_name: getSkillName(item), item_id: item };
        });
        const select_item_ctrl = new SelectCtrl(select_item, item_menu);
        select_item_ctrl.setRender(this.renderSelectItem);
        select_item_ctrl.init();
        select_item_ctrl.setList(item_list);

        this.select_coin_ctrl = select_coin_ctrl;
        this.select_item_ctrl = select_item_ctrl;
    }
    private renderSelectCoin(box: SelectCoin, data: CoinData) {
        // console.log(box.parent);
        const { coin_icon, coin_name } = box;
        const { coin_icon: icon, coin_name: name } = data;
        coin_icon.skin = icon;
        coin_name.text = name;
    }
    private renderSelectItem(box: SelectItem, data: ItemData) {
        // console.log(box.parent);
        const { item_name: item_name_label } = box;
        const { item_name } = data;
        item_name_label.text = item_name;
    }
    public renderCoinMenu(data: AccountMap) {
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
}
