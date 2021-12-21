import honor, { HonorDialog } from 'honor';
import { Handler } from 'laya/utils/Handler';

import { GetHallOfFameData, GetHallOfFameDataItem } from '@app/api/arenaApi';
import { ui } from '@app/ui/layaMaxUI';

import { arenaGetHallOfFame } from './popSocket';

export default class ArenaTopPlayerPop
    extends ui.pop.arenaTopPlayer.arenaTopPlayerUI
    implements HonorDialog
{
    public isModal = true;
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: ArenaTopPlayerPop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaTopPlayerPop;

        return pop;
    }
    public async onAwake() {
        this.initEvent();
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
    public onEnable() {
        arenaGetHallOfFame().then((data) => {
            if (data) {
                this.initData(data);
            }
        });
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

        score_label.text = `积分：${data.score}`;
        nickname_label.text = `${data.userId}`;
        time_label.text = `${data.startDate}-${data.endDate}`;
    }
}