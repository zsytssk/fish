import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';

type LotteryData = {
    id: string;
    type: string;
    num: number;
};
type LotteryRenderData = {
    cur: boolean;
    lottery_id: string;
    lottery_type: string;
    lottery_num: number;
};
type ExchangeData = {
    id: string;
    price_num: number;
    type: string;
    price_type: string;
    remain: number;
    num: number;
};
type ExchangeRenderData = {
    exchange_id: string;
    price_type: string;
    exchange_type: string;
    price_num: number;
    remain: number;
    exchange_num: number;
};

type Data = {
    lottery: LotteryData[];
    exchange: ExchangeData[];
};
type LotteryItemUI = ui.pop.lottery.itemUI;
type ExchangeItemUI = ui.pop.lottery.item2UI;

/** 抽奖弹出层 */
export default class LotteryPop extends ui.pop.lottery.lotteryUI
    implements HonorDialog {
    private is_init = false;
    public isModal = true;
    private lottery_interval: number;
    public static preEnter() {
        honor.director.openDialog(LotteryPop);
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
            console.log(`抽奖`);
        });
    }
    public initData(data: Data) {
        const { lottery, exchange } = data;
        const { lottery_list, exchange_list } = this;

        const lottery_arr = [] as LotteryRenderData[];
        for (const lottery_item of lottery) {
            const {
                id: lottery_id,
                type: lottery_type,
                num: lottery_num,
            } = lottery_item;

            lottery_arr.push({
                lottery_id,
                lottery_type,
                lottery_num,
                cur: false,
            });
        }

        const exchange_arr = [] as ExchangeRenderData[];
        for (const exchange_item of exchange) {
            const {
                id: exchange_id,
                type: exchange_type,
                num: exchange_num,
                remain,
                price_num,
                price_type,
            } = exchange_item;

            exchange_arr.push({
                exchange_id,
                exchange_type,
                exchange_num,
                price_num,
                price_type,
                remain,
            });
        }

        lottery_list.array = lottery_arr;
        exchange_list.array = exchange_arr;
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
    /** 抽奖 */
    public runLottery(id: string) {
        const { lottery_list, progress, btn_lottery } = this;
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
            progress.value = index / dist_num;
            if (index >= dist_num) {
                this.completeLottery();
            }
        }, 300) as any;
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

        const {
            exchange_id,
            exchange_type,
            exchange_num,
            price_num,
            price_type,
            remain,
        } = this.exchange_list.array[index] as ExchangeRenderData;

        price_label.text = price_num + '';
        price_tag.skin = `image/pop/lottery/tag_${price_type}.png`;
        num_label.text = exchange_num + '';
        type_label.text = exchange_type + '';
        remain_label.text = `剩余${remain}`;
        btn_buy.on(Laya.Event.CLICK, btn_buy, () => {
            console.log(`buy ${exchange_id}`);
        });
    }; // tslint:disable-line
    public destroy() {
        super.destroy();
        this.completeLottery();
    }
}
