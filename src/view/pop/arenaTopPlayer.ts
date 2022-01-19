import honor, { HonorDialog } from 'honor';
import { Handler } from 'laya/utils/Handler';

import { GetHallOfFameData, GetHallOfFameDataItem } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { formatDateRange } from '@app/utils/dayjsUtil';
import { tplIntr } from '@app/utils/utils';

export default class ArenaTopPlayerPop
    extends ui.pop.arenaTopPlayer.arenaTopPlayerUI
    implements HonorDialog
{
    public static async preEnter(data: GetHallOfFameData) {
        const pop = await honor.director.openDialog<ArenaTopPlayerPop>(
            'pop/arenaTopPlayer/arenaTopPlayer.scene',
        );
        pop.initData(data);
        AudioCtrl.play(AudioRes.PopShow);
        return pop;
    }
    public async onAwake() {
        onLangChange(this, () => {
            this.initLang();
        });
        this.initEvent();
    }
    private initLang() {
        const { title } = this;
        title.text = tplIntr('arenaTopPlayerTitle');
    }
    private initEvent() {
        const { list } = this;
        list.renderHandler = new Handler(
            this,
            this.listRenderHandler,
            null,
            false,
        );
    }
    public initData(data: GetHallOfFameData) {
        const { list, empty_tip } = this;
        list.array = data;
        list.hScrollBarSkin = '';
        empty_tip.visible = Boolean(!data?.length);
        if (data.length <= 3) {
            list.width = data.length * 177 + (data.length - 1) * 10 + 16 * 2;
        } else {
            list.width = 955;
        }
        list.centerX = list.centerX === 0 ? -1 : 0;
    }
    private listRenderHandler(
        box: ui.pop.arenaTopPlayer.itemUI,
        index: number,
    ) {
        const { time_label, nickname_label, score_label } = box;
        const data = this.list.array[index] as GetHallOfFameDataItem;

        score_label.text = tplIntr('score', { score: data.score });
        nickname_label.text = `${data.userId}`;
        time_label.text = formatDateRange([data.startDate, data.endDate]);
    }
}
