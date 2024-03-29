import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';

import { SettleData } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { onNodeWithAni } from '@app/utils/layaUtils';
import { tplIntr } from '@app/utils/utils';

type SettleType = 'continue' | 'not_continue';
export default class ArenaSettlePop
    extends ui.pop.arenaSettle.arenaSettleUI
    implements HonorDialog
{
    public resolve: (type: SettleType) => void;
    public static async preEnter(data: SettleData) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<SettleType>(async (resolve, _reject) => {
            const pop = await honor.director.openDialog<ArenaSettlePop>(
                'pop/arenaSettle/arenaSettle.scene',
            );
            AudioCtrl.play(AudioRes.PopShow);
            pop.initData(data);
            pop.resolve = resolve;
            return pop;
        });
    }

    public onClosed(type?: SettleType): void {
        type = type === 'continue' ? type : 'not_continue';
        this.resolve(type);
    }

    public async onAwake() {
        onLangChange(this, () => {
            this.initLang();
        });
        this.initEvent();
    }
    private initLang() {
        const { name_label, title, tip_label } = this;
        title.text = tplIntr('arenaSettleTitle');
        tip_label.text = tplIntr('arenaSettle1');
        name_label.text = tplIntr('arenaSettle2');
    }
    private initEvent() {
        const { btn_continue } = this;
        onNodeWithAni(btn_continue, Event.CLICK, () => {
            this.close('continue');
        });
    }
    public initData(data: SettleData) {
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
        const {
            num_label,
            guess_label,
            info_label,
            btn_label,
            btn_continue,
            reward_box,
        } = this;

        btn_label.text = tplIntr('arenaSettleReSign', {
            fee,
            currency,
        });
        const width = btn_label.getBounds().width + 40;
        btn_continue.width = width > 230 ? width : 230;

        guess_label.text = tplIntr('arenaSettleReStatic', { score });
        info_label.text = tplIntr('arenaSettleTpl', {
            userId,
            ranking: ranking || '~',
            maxDayScore: maxDayScore || '~',
            score,
        });
        num_label.text = rankingAward + '';

        guess_label.visible = isGuest;
        info_label.visible = reward_box.visible = !isGuest;
    }
}
