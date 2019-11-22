import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { getLotteryData, runLottery, runTicketExchange } from './popSocket';
import { createDarkFilter } from 'utils/utils';
import TopTipPop from './topTip';
import { AudioRes } from 'data/audioRes';
import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';

type LotteryData = {
    lottery_id: string;
    lottery_type: string;
    lottery_num: number;
};
type LotteryRenderData = {
    cur: boolean;
} & LotteryData;
type ExchangeData = {
    exchange_id: string;
    exchange_type: string;
    cost_num: number;
    cur_num: number;
    exchange_num: number;
};
type ExchangeRenderData = ExchangeData;

export type LotteryPopData = {
    lottery: LotteryData[];
    exchange: ExchangeData[];
    lottery_num: number;
    lottery_cost: number;
};
type LotteryItemUI = ui.pop.lottery.itemUI;
type ExchangeItemUI = ui.pop.lottery.item2UI;

/** 抽奖弹出层 */
export default class LotteryPop extends ui.pop.lottery.lotteryUI
    implements HonorDialog {
    private is_init = false;
    public isModal = true;
    private lottery_interval: number;
    private remain_info: {
        lottery_num: number;
        lottery_cost: number;
    };
    public static preEnter() {
        AudioCtrl.play(AudioRes.PopShow);
        const pop = honor.director.openDialog(LotteryPop) as Promise<
            LotteryPop
        >;
        const exchange_data = getLotteryData();

        return Promise.all([pop, exchange_data]).then(([dialog, data]) => {
            dialog.initData(data);
        });
    }
    public onMounted() {
        if (!this.is_init) {
            this.init();
        }
        this.is_init = true;
    }
    private init() {
        const { lottery_list, exchange_list, btn_lottery } = this;
        lottery_list.array = [];
        exchange_list.array = [];

        lottery_list.renderHandler = new Laya.Handler(
            lottery_list,
            this.renderLottery,
            undefined,
            false,
        );
        exchange_list.renderHandler = new Laya.Handler(
            lottery_list,
            this.renderExchange,
            undefined,
            false,
        );
        btn_lottery.on(Laya.Event.CLICK, btn_lottery, () => {
            this.runLottery();
        });
    }
    public initData(data: LotteryPopData) {
        const { lottery, exchange, lottery_cost, lottery_num } = data;
        const { lottery_list, exchange_list, progress, lottery_remain } = this;

        const lottery_arr = [] as LotteryRenderData[];
        for (const lottery_item of lottery) {
            lottery_arr.push({
                ...lottery_item,
                cur: false,
            });
        }

        progress.value = lottery_num / lottery_cost;
        lottery_remain.text = `${lottery_num}/${lottery_cost}`;
        lottery_list.array = lottery_arr;
        exchange_list.array = exchange;

        this.remain_info = {
            lottery_num,
            lottery_cost,
        };
    }
    private renderLottery = (box: LotteryItemUI, index: number) => {
        const {
            light,
            cur_light,
            item_num,
            item_type,
            bullet_icon,
            bullet_num,
        } = box;
        const { cur, lottery_type, lottery_num } = this.lottery_list.array[
            index
        ] as LotteryRenderData;

        cur_light.visible = cur;
        const is_bullet = lottery_type === 'bullet';
        bullet_icon.visible = bullet_num.visible = is_bullet;
        light.visible = item_type.visible = item_num.visible = !is_bullet;
        item_type.text = lottery_type;
        bullet_num.text = item_num.text = lottery_num + '';
    }; // tslint:disable-line
    private runLottery() {
        const { remain_info, progress, lottery_remain } = this;
        let { lottery_num } = remain_info;
        const { lottery_cost } = remain_info;

        if (lottery_num < lottery_cost) {
            return;
        }

        runLottery().then(async id => {
            await this.runLotteryAni(id);
            lottery_num = lottery_num - lottery_cost;
            progress.value = lottery_num / lottery_cost;
            lottery_remain.text = `${lottery_num}/${lottery_cost}`;
        });
    }
    /** 抽奖动画 */
    public runLotteryAni(id: string) {
        return new Promise((resolve, reject) => {
            const { lottery_list, btn_lottery } = this;
            const arr = lottery_list.array as LotteryRenderData[];

            btn_lottery.disabled = true;
            const dist_index = arr.findIndex(item => {
                return item.lottery_id === id;
            });

            let index = 0;
            const dist_num = dist_index + 20;
            this.lottery_interval = setInterval(() => {
                const cur_index = index % arr.length;
                for (let i = 0; i < arr.length; i++) {
                    if (i === cur_index) {
                        arr[i].cur = true;
                    } else {
                        arr[i].cur = false;
                    }
                }
                lottery_list.refresh();
                index++;
                if (index >= dist_num) {
                    this.completeLottery();
                    resolve();
                }
            }, 300) as any;
        });
    }
    private completeLottery() {
        const { btn_lottery } = this;
        btn_lottery.disabled = false;
        clearInterval(this.lottery_interval);
    }
    private renderExchange = (box: ExchangeItemUI, index: number) => {
        const {
            price_label,
            price_tag,
            remain_label,
            num_label,
            type_label,
            btn_buy,
        } = box;

        const data = this.exchange_list.array[index] as ExchangeRenderData;
        const {
            exchange_type,
            exchange_num,
            cost_num,
            cur_num,
        } = data as ExchangeRenderData;

        price_label.text = cost_num + '';
        price_tag.skin = `image/pop/lottery/tag_${exchange_type}.png`;
        num_label.text = exchange_num + '';
        type_label.text = exchange_type + '';
        remain_label.text = `剩余${cur_num}/${cost_num}`;

        btn_buy.offAll();
        if (cur_num < cost_num) {
            box.filters = [createDarkFilter()];
        } else {
            box.filters = null;
            btn_buy.on(Laya.Event.CLICK, btn_buy, () => {
                this.runTicketExchange(index);
            });
        }
    };
    private async runTicketExchange(index: number) {
        const data = this.exchange_list.array[index] as ExchangeRenderData;
        const { exchange_id, cost_num, cur_num } = data as ExchangeRenderData;
        await runTicketExchange(exchange_id);
        TopTipPop.tip('购买成功..');
        this.exchange_list.array[index] = {
            ...data,
            cur_num: cur_num - cost_num,
        };
        this.exchange_list.refresh();
    }
    public destroy() {
        super.destroy();
        this.completeLottery();
    }
}
