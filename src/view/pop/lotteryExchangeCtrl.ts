import { afterActive } from 'honor/utils/tool';
import { Event } from 'laya/events/Event';
import { Box } from 'laya/ui/Box';

import { getLang } from '@app/ctrl/hall/hallCtrlUtil';
import { ItemMap } from '@app/data/config';
import { InternationalTip } from '@app/data/internationalConfig';
import { getCurrencyIcon } from '@app/model/userInfo/userInfoUtils';
import { ui } from '@app/ui/layaMaxUI';
import { createDarkFilter, createColorFilter } from '@app/utils/utils';

import { ExchangeData } from './lottery';
import { runTicketExchange } from './popSocket';
import RewardPop from './reward';

type Item =
    | ui.pop.lottery.item2oneUI
    | ui.pop.lottery.item2UI
    | ui.pop.lottery.item2fiveUI;
export class LotteryExchangeCtrl {
    private view: Box;
    private item_list: Item[] = [];
    private data: ExchangeData[] = [];
    constructor(view: Box) {
        this.view = view;
        this.clear();
    }
    public async renderData(data: ExchangeData[]) {
        const { view } = this;
        const { length } = data;
        this.data = data;

        this.clear();
        let ItemCtor: Ctor<Item>;
        let space = 10;
        let width = 0;
        if (length === 1) {
            ItemCtor = ui.pop.lottery.item2oneUI;
        } else if (length === 5) {
            ItemCtor = ui.pop.lottery.item2fiveUI;
            space = 5;
        } else if (length === 2) {
            ItemCtor = ui.pop.lottery.item2twoUI;
            space = 50;
        } else if (length === 3) {
            space = 80;
            ItemCtor = ui.pop.lottery.item2UI;
        } else {
            ItemCtor = ui.pop.lottery.item2UI;
        }
        for (const [index, item_data] of data.entries()) {
            const item = new ItemCtor();
            view.addChild(item);
            this.item_list.push(item);
            await afterActive(item);
            item.x = width;
            width += item.width;
            if (index !== data.length - 1) {
                width += space;
            }
        }
        view.width = width;
        this.refresh();
    }
    public refresh() {
        const { data, item_list } = this;
        for (const [index, item] of item_list.entries()) {
            this.renderItem(item, data[index]);
        }
    }
    private renderItem(item: Item, item_data: ExchangeData) {
        const {
            price_label,
            coin_icon,
            remain_label,
            num_label,
            btn_buy,
            item_type,
        } = item;
        const lang = getLang();
        const { Num } = InternationalTip[lang];

        const { exchange_type, exchange_id, exchange_num, cost_num, cur_num } =
            item_data;

        let tag = ItemMap[exchange_id] as string;
        tag = tag ? tag.toLowerCase() : tag;
        const num_str = exchange_num + '';
        price_label.text = cost_num + '';
        const icon_url = getCurrencyIcon(exchange_type);
        coin_icon.skin = icon_url;
        // coin_icon.skin =
        //     'http://static.btgame.club/public-test/img/coin/15905806992912UL8JD1I.png';
        coin_icon.filters = [createColorFilter('#64280e')];
        num_label.text = num_str;
        item_type.text = exchange_type.toUpperCase();
        remain_label.text = `${Num}: ${cur_num}/${cost_num}`;

        let scale = 1 / (num_str.length / 3);
        let scale2 = 1 / (exchange_type.length / 4);
        scale = scale > 1 ? 1 : scale;
        scale2 = scale2 > 0.95 ? 0.95 : scale2;
        num_label.scale(scale, scale);
        item_type.scale(scale2, scale2);

        btn_buy.offAll();
        if (cur_num < cost_num) {
            item.filters = [createDarkFilter(0.3)];
        } else {
            item.filters = null;
            btn_buy.on(Event.CLICK, btn_buy, () => {
                this.runTicketExchange(item_data);
            });
        }
    }

    private async runTicketExchange(item_data: ExchangeData) {
        const { exchange_id, cost_num, cur_num, exchange_type } = item_data;
        const { num } = await runTicketExchange(exchange_id);
        RewardPop.preEnter({ type: exchange_type, num });
        item_data.cur_num = cur_num - cost_num;
        this.refresh();
    }
    private clear() {
        const { view } = this;
        view.removeChildren();
        this.item_list = [];
    }

    public destroy() {
        this.item_list = [];
        this.data = [];
        this.clear();
        this.view = undefined;
    }
}
