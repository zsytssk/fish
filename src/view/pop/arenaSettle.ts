import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';

import { SettleData } from '@app/api/arenaApi';
import { ui } from '@app/ui/layaMaxUI';
import { onNodeWithAni } from '@app/utils/layaUtils';

export default class ArenaSettlePop
    extends ui.pop.arenaSettle.arenaSettleUI
    implements HonorDialog
{
    public isModal = true;
    public static async preEnter(data: SettleData) {
        const pop = (await honor.director.openDialog({
            dialog: ArenaSettlePop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaSettlePop;

        pop.initData(data);
        return pop;
    }
    public async onAwake() {
        this.initEvent();
    }
    private initEvent() {
        const { btn_continue } = this;
        onNodeWithAni(btn_continue, Event.CLICK, () => {
            alert(1);
        });
    }

    public initData(data: SettleData) {
        const { userId, ranking, maxDayScore, score, rankingAward } = data;
        const { num_label, currency_label, info_label, btn_continue } = this;

        btn_continue.label = '重新参赛 1USDT';
        currency_label.text = '重新参赛 1USDT';
        info_label.text = `${userId}\n当前排名：${ranking}\n今日最高捕获分数： ${maxDayScore}\n本次捕获分数：${score}`;
        num_label.text = rankingAward + '';
    }
}
