import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';

import { SettleData } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { onNodeWithAni } from '@app/utils/layaUtils';

type SettleType = 'continue' | 'not_continue';
export default class ArenaSettlePop
    extends ui.pop.arenaSettle.arenaSettleUI
    implements HonorDialog
{
    public isModal = true;
    public resolve: (type: SettleType) => void;
    public static async preEnter(data: SettleData) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<SettleType>(async (resolve, _reject) => {
            const pop = (await honor.director.openDialog({
                dialog: ArenaSettlePop,
                use_exist: true,
                stay_scene: true,
            })) as ArenaSettlePop;
            AudioCtrl.play(AudioRes.PopShow);
            pop.initData(data, resolve);
            return pop;
        });
    }

    public onClosed(type?: SettleType): void {
        type = type === 'continue' ? type : 'not_continue';
        console.log(`test:>onClosed`, type);
        this.resolve(type);
    }

    public async onAwake() {
        this.initEvent();
    }
    private initEvent() {
        const { btn_continue } = this;
        onNodeWithAni(btn_continue, Event.CLICK, () => {
            this.close('continue');
        });
    }

    public initData(data: SettleData, resolve: (type: SettleType) => void) {
        const {
            userId,
            ranking,
            maxDayScore,
            score,
            rankingAward,
            fee,
            isGuest,
            currency,
        } = data;
        const { num_label, guess_label, info_label, btn_continue, reward_box } =
            this;

        btn_continue.label = `重新参赛 ${fee}${currency}`;
        guess_label.text = `本次捕获分数：${score}`;
        info_label.text = `${userId}\n当前排名：${
            ranking || '~'
        }\n今日最高捕获分数： ${maxDayScore}\n本次捕获分数：${score}`;
        num_label.text = rankingAward + '';

        guess_label.visible = isGuest;
        info_label.visible = reward_box.visible = !isGuest;
        this.resolve = resolve;
    }
}
