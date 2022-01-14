import honor, { HonorDialog } from 'honor';
import { openDialog } from 'honor/ui/sceneManager';
import { Handler } from 'laya/utils/Handler';

import { GetHallOfFameData, GetHallOfFameDataItem } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { tplIntr } from '@app/utils/utils';

export default class ArenaTopPlayerPop
    extends ui.pop.arenaTopPlayer.arenaTopPlayerUI
    implements HonorDialog
{
    public static async preEnter(data: GetHallOfFameData) {
        const pop = await openDialog<ArenaTopPlayerPop>(
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
        const { list } = this;
        list.array = data;
        list.hScrollBarSkin = '';
    }
    private listRenderHandler(
        box: ui.pop.arenaTopPlayer.itemUI,
        index: number,
    ) {
        const { time_label, nickname_label, score_label } = box;
        const data = this.list.array[index] as GetHallOfFameDataItem;

        score_label.text = tplIntr('score', { score: data.score });
        nickname_label.text = `${data.userId}`;
        time_label.text = `${data.startDate}-${data.endDate}`;
    }
}
