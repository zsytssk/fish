import honor, { HonorDialog } from 'honor';
import { Box } from 'laya/ui/Box';
import { Clip } from 'laya/ui/Clip';
import { Label } from 'laya/ui/Label';
import { Handler } from 'laya/utils/Handler';

import { GetDayRanking, GetDayRankingItem } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';

import { arenaGetDayRanking } from './popSocket';

export default class ArenaRankPop
    extends ui.pop.arenaRank.arenaRankUI
    implements HonorDialog
{
    public isModal = true;
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: ArenaRankPop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaRankPop;

        AudioCtrl.play(AudioRes.PopShow);
        return pop;
    }
    public async onAwake() {
        this.initEvent();
    }
    private initEvent() {
        const { tab, tabBody, today_list, yes_list } = this;

        tab.selectHandler = new Handler(
            this,
            (index: number) => {
                tabBody.selectedIndex = index;
            },
            null,
            false,
        );
        today_list.renderHandler = new Handler(
            this,
            this.renderList,
            ['today'],
            false,
        );
        yes_list.renderHandler = new Handler(
            this,
            this.renderList,
            ['yesterday'],
            false,
        );
    }
    public onEnable() {
        arenaGetDayRanking().then((data) => {
            if (data) {
                this.initData(data);
            }
        });
    }
    public initData(data: GetDayRanking) {
        const { today_list, yes_list } = this;
        const { today, yesterday } = data;

        today_list.array = today;
        yes_list.array = yesterday;
    }
    private renderList(type: 'today' | 'yesterday', box: Box, index: number) {
        let data = this.today_list.array[index] as GetDayRankingItem;
        if (type === 'yesterday') {
            data = this.yes_list.array[index];
        }

        const clip = box.getChildByName('clip') as Clip;
        const label1 = box.getChildByName('label1') as Label;
        const label2 = box.getChildByName('label2') as Label;
        const label3 = box.getChildByName('label3') as Label;
        clip.index = index;
        label1.text = data.userId + '';
        label2.text = `获得积分：${data.score}`;
        label3.text = `预计奖励：${data.award}`;
    }
}
