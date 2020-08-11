import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { changeBulletNum } from 'ctrl/game/gameCtrlUtils';
import { offLangChange, onLangChange } from 'ctrl/hall/hallCtrlUtil';
import { AudioRes } from 'data/audioRes';
import { InternationalTip, Lang } from 'data/internationalConfig';
import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { Handler } from 'laya/utils/Handler';
import { ui } from 'ui/layaMaxUI';
import { tween } from 'utils/layaTween';
import { onNode, resizeParent } from 'utils/layaUtils';
import { playSkeletonOnce } from 'utils/utils';
import { LotteryExchangeCtrl } from './lotteryExchangeCtrl';
import { getLotteryData, runLottery } from './popSocket';
import RewardPop from './reward';
import { sleep } from 'utils/animate';
import HelpPop from './help';
import { loaderManager } from 'honor/state';
import { log } from 'utils/log';

type LotteryData = {
    lottery_id: string;
    lottery_type: string;
    lottery_num: number;
};
type LotteryRenderData = {
    cur: boolean;
    get: boolean;
} & LotteryData;
export type ExchangeData = {
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

/** 抽奖弹出层 */
export default class LotteryPop extends ui.pop.lottery.lotteryUI
    implements HonorDialog {
    private is_init = false;
    public isModal = true;
    private lottery_interval: number;
    private lottery_exchange_ctrl: LotteryExchangeCtrl;
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
    public static preLoad() {
        return loaderManager.preLoad('Dialog', 'pop/lottery/lottery.scene');
    }
    public async reloadData() {
        const exchange_data = await getLotteryData();
        this.initData(exchange_data);
    }
    public onEnable() {
        AudioCtrl.play(AudioRes.PopShow);
        if (!this.is_init) {
            this.init();
        }
        this.is_init = true;
    }
    private init() {
        const { lottery_list, btn_lottery, lottery_exchange_ctrl } = this;
        lottery_list.array = [];
        this.lottery_exchange_ctrl = new LotteryExchangeCtrl(
            this.exchange_list,
        );

        lottery_list.renderHandler = new Handler(
            lottery_list,
            this.renderLottery,
            undefined,
            false,
        );
        onNode(btn_lottery, Event.CLICK, () => {
            this.runLottery();
        });
    }
    public initData(data: LotteryPopData) {
        const { lottery, exchange, lottery_cost, lottery_num } = data;
        const {
            lottery_list,
            progress,
            lottery_remain,
            lottery_exchange_ctrl,
            btn_lottery,
        } = this;

        const lottery_arr = [] as LotteryRenderData[];
        for (const lottery_item of lottery) {
            lottery_arr.push({
                ...lottery_item,
                cur: false,
                get: false,
            });
        }

        const len = lottery_arr.length;
        if (len < 5) {
            log(`test:>lottery:>0`, lottery_arr);
            for (let i = 0; i < 5 - len; i++) {
                lottery_arr.push({
                    lottery_id: 'xx',
                    lottery_type: 'xx',
                    lottery_num: 0,
                    cur: false,
                    get: false,
                });
            }
        }

        const val = lottery_num / lottery_cost;
        progress.value = val > 1 ? 1 : val;
        lottery_remain.text = `${lottery_num}/${lottery_cost}`;
        lottery_list.array = lottery_arr;
        log(`test:>lottery:>1`, val, lottery_arr);
        btn_lottery.disabled = val < 1;
        lottery_exchange_ctrl.renderData([...exchange]);

        this.remain_info = {
            lottery_num,
            lottery_cost,
        };
    }
    private renderLottery = (box: LotteryItemUI, index: number) => {
        const { light, light_circle, box_ani, box_img } = box;
        const data = this.lottery_list.array[index] as LotteryRenderData;
        const { cur, get, lottery_num } = data;

        light_circle.visible = false;
        light.visible = false;
        box_img.visible = true;
        box_ani.visible = false;
        if (!cur) {
            return;
        }
        const ani_name = get ? 'active' : 'move';
        light.visible = true;
        if (ani_name === 'move') {
            light_circle.visible = true;
        } else {
            box_img.visible = false;
            box_ani.visible = true;
            playSkeletonOnce(box_ani, 0).then(() => {
                return playSkeletonOnce(light, ani_name).then(() => {
                    this.showLotteryAward(data);
                });
            });
            light.playbackRate(1);
        }
    }; // tslint:disable-line
    private runLottery() {
        const { remain_info, progress, lottery_remain, btn_lottery } = this;
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
            btn_lottery.disabled = lottery_num < lottery_cost;
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
                    sleep(2).then(() => {
                        this.completeLottery();
                        resolve();
                    });
                }

                lottery_list.refresh();
            });
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
        RewardPop.preEnter({ type: lottery_type, num: lottery_num }).then(
            () => {
                this.reloadData();
            },
        );
    }

    public destroy() {
        const { lottery_exchange_ctrl } = this;
        this.completeLottery();
        offLangChange(this);
        super.destroy();
        lottery_exchange_ctrl.destroy();
        this.lottery_exchange_ctrl = undefined;
    }
    public onAwake() {
        const { btn_help } = this;
        onLangChange(this, lang => {
            this.initLang(lang);
        });
        btn_help.on(Event.CLICK, this, () => {
            HelpPop.preEnter(2);
        });
    }
    private initLang(lang: Lang) {
        const { title, btn_label, sub_title, lottery_exchange_ctrl } = this;
        const { luckyDraw, redemption } = InternationalTip[lang];
        btn_label.text = luckyDraw;
        sub_title.text = redemption;
        lottery_exchange_ctrl.refresh();
        resizeParent(btn_label, 30, 142);

        title.skin = `image/international/txt_lottery_${lang}.png`;
    }
}
