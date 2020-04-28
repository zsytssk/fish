import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { changeBulletNum } from 'ctrl/game/gameCtrlUtils';
import { getLang, offLangChange, onLangChange } from 'ctrl/hall/hallCtrlUtil';
import { AudioRes } from 'data/audioRes';
import { ItemMap } from 'data/config';
import { InternationalTip, Lang } from 'data/internationalConfig';
import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { Handler } from 'laya/utils/Handler';
import { ui } from 'ui/layaMaxUI';
import { tween } from 'utils/layaTween';
import { onNode, resizeParent } from 'utils/layaUtils';
import { createDarkFilter, playSkeletonOnce } from 'utils/utils';
import { getLotteryData, runLottery, runTicketExchange } from './popSocket';
import RewardPop from './reward';

type LotteryData = {
    lottery_id: string;
    lottery_type: string;
    lottery_num: number;
};
type LotteryRenderData = {
    cur: boolean;
    get: boolean;
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
        const pop = honor.director.openDialog({
            dialog: LotteryPop,
            use_exist: true,
        }) as Promise<LotteryPop>;
        const exchange_data = getLotteryData();

        return Promise.all([pop, exchange_data]).then(([dialog, data]) => {
            dialog.initData(data);
        });
    }
    public onEnable() {
        AudioCtrl.play(AudioRes.PopShow);
        if (!this.is_init) {
            this.init();
        }
        this.is_init = true;
    }
    private init() {
        const { lottery_list, exchange_list, btn_lottery } = this;
        lottery_list.array = [];
        exchange_list.array = [];

        lottery_list.renderHandler = new Handler(
            lottery_list,
            this.renderLottery,
            undefined,
            false,
        );
        exchange_list.renderHandler = new Handler(
            lottery_list,
            this.renderExchange,
            undefined,
            false,
        );
        onNode(btn_lottery, Event.CLICK, () => {
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
                get: false,
            });
        }

        const val = lottery_num / lottery_cost;
        progress.value = val > 1 ? 1 : val;
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
            item_num,
            item_type,
            bullet_icon,
            bullet_num,
            light_circle,
        } = box;
        const data = this.lottery_list.array[index] as LotteryRenderData;
        const { cur, get, lottery_type, lottery_num } = data;

        const num_str = lottery_num + '';
        const is_bullet = lottery_type === 'bullet';

        bullet_icon.visible = bullet_num.visible = is_bullet;
        item_type.visible = item_num.visible = !is_bullet;
        if (!is_bullet) {
            item_type.skin = `image/pop/lottery/txt_${lottery_type.toLowerCase()}.png`;
        }

        let scale = 1 / (num_str.length / 4);
        scale = scale > 1 ? 1 : scale;
        item_num.scale(scale, scale);
        bullet_num.text = item_num.text = num_str;
        light_circle.visible = false;
        light.visible = false;
        if (!cur) {
            return;
        }
        const ani_name = get ? 'active' : 'move';
        light.visible = true;
        if (ani_name === 'move') {
            light_circle.visible = true;
        } else {
            light.playbackRate(1);
            playSkeletonOnce(light, ani_name).then(() => {
                this.showLotteryAward(data);
            });
        }
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
            remain_info.lottery_num = lottery_num;
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

            const dist_num = dist_index + 20;
            let end = false;
            tween(3000, radio => {
                const cur_index = Math.round(radio * dist_num);
                const round_index = cur_index % 5;
                if (end) {
                    return;
                }
                if (radio === 1) {
                    end = true;
                }
                for (let i = 0; i < arr.length; i++) {
                    const item = arr[i];
                    item.get = false;
                    if (i === round_index) {
                        item.cur = true;
                    } else {
                        item.cur = false;
                    }
                }
                if (end) {
                    arr[round_index].get = true;
                    arr[round_index].cur = true;
                    this.completeLottery();
                    resolve();
                }

                lottery_list.refresh();
            });

            // let index = 0;
            // this.lottery_interval = setInterval(() => {
            //     const cur_index = index % arr.length;
            //     for (let i = 0; i < arr.length; i++) {
            //         const item = arr[i];
            //         item.get = false;
            //         if (i === cur_index) {
            //             item.cur = true;
            //         } else {
            //             item.cur = false;
            //         }
            //     }
            //     if (index >= dist_num) {
            //         arr[dist_index].get = true;
            //         arr[dist_index].cur = true;
            //         this.completeLottery();
            //         lottery_list.refresh();
            //         resolve();
            //         return;
            //     }
            //     lottery_list.refresh();
            //     index++;
            // }, 80) as any;
        });
    }
    private completeLottery() {
        const { btn_lottery } = this;
        btn_lottery.disabled = false;
        clearInterval(this.lottery_interval);
    }
    private showLotteryAward(data: LotteryRenderData) {
        const { lottery_type, lottery_num } = data;
        const is_bullet = lottery_type === 'bullet';

        if (is_bullet) {
            changeBulletNum(lottery_num);
        }
        RewardPop.preEnter({ type: lottery_type, num: lottery_num });
    }
    private renderExchange = (box: ExchangeItemUI, index: number) => {
        const {
            price_label,
            price_tag,
            remain_label,
            num_label,
            btn_buy,
            item_type,
        } = box;
        const lang = getLang();
        const { remaining } = InternationalTip[lang];

        const data = this.exchange_list.array[index] as ExchangeRenderData;
        const {
            exchange_type,
            exchange_id,
            exchange_num,
            cost_num,
            cur_num,
        } = data as ExchangeRenderData;
        let tag = ItemMap[exchange_id] as string;
        tag = tag ? tag.toLowerCase() : tag;
        const num_str = exchange_num + '';
        price_label.text = cost_num + '';
        price_tag.skin = `image/pop/lottery/tag_${tag}.png`;
        num_label.text = num_str;
        item_type.skin = `image/pop/lottery/txt_${exchange_type.toLowerCase()}.png`;
        remain_label.text = `${remaining}${cur_num}/${cost_num}`;

        let scale = 1 / (num_str.length / 3);
        scale = scale > 1 ? 1 : scale;
        num_label.scale(scale, scale);

        btn_buy.offAll();
        if (cur_num < cost_num) {
            box.filters = [createDarkFilter(0.3)];
        } else {
            box.filters = null;
            btn_buy.on(Event.CLICK, btn_buy, () => {
                this.runTicketExchange(index);
            });
        }
    }; // tslint:disable-line
    private async runTicketExchange(index: number) {
        const data = this.exchange_list.array[index] as ExchangeRenderData;
        const {
            exchange_id,
            cost_num,
            cur_num,
            exchange_type,
        } = data as ExchangeRenderData;
        await runTicketExchange(exchange_id);
        RewardPop.preEnter({ type: exchange_type, num: cost_num });
        this.exchange_list.array[index] = {
            ...data,
            cur_num: cur_num - cost_num,
        };
        this.exchange_list.refresh();
    }
    public destroy() {
        this.completeLottery();
        offLangChange(this);
        super.destroy();
    }
    public onAwake() {
        onLangChange(this, lang => {
            this.initLang(lang);
        });
    }
    private initLang(lang: Lang) {
        const { title, btn_label, sub_title, exchange_list } = this;
        const { luckyDraw, redemption } = InternationalTip[lang];
        btn_label.text = luckyDraw;
        sub_title.text = redemption;
        exchange_list.refresh();
        resizeParent(btn_label, 30, 142);

        title.skin = `image/international/txt_lottery_${lang}.png`;
    }
}
