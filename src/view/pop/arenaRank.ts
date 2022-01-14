import honor, { HonorDialog } from 'honor';
import { Box } from 'laya/ui/Box';
import { Clip } from 'laya/ui/Clip';
import { Label } from 'laya/ui/Label';
import { Handler } from 'laya/utils/Handler';

import { GetDayRanking, GetDayRankingItem } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { tplIntr } from '@app/utils/utils';

export default class ArenaRankPop
    extends ui.pop.arenaRank.arenaRankUI
    implements HonorDialog
{
    public static async preEnter(data: GetDayRanking) {
        const pop = await honor.director.openDialog<ArenaRankPop>(
            'pop/arenaRank/arenaRank.scene',
        );

        AudioCtrl.play(AudioRes.PopShow);
        pop.initData(data);
        return pop;
    }
    public async onAwake() {
        onLangChange(this, () => {
            this.initLang();
        });

        this.initEvent();
    }
    private initLang() {
        const { tab0, title, tab1, today_empty_tip, yes_empty_tip } = this;
        title.text = tplIntr('arenaRankTitle');
        tab0.label = tplIntr('arenaRankTab0');
        tab1.label = tplIntr('arenaRankTab1');
        today_empty_tip.text = yes_empty_tip.text = tplIntr('noData');
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
        today_list.array = [];
        yes_list.array = [];
    }
    public initData(data: GetDayRanking) {
        const { yes_empty_tip, today_empty_tip, today_list, yes_list } = this;
        const { today, yesterday } = data;

        today_empty_tip.visible = Boolean(!today?.length);
        yes_empty_tip.visible = Boolean(!yesterday?.length);
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
        label2.text = tplIntr('arenaRankScore', { score: data.score });
        label3.text = tplIntr('arenaRankAward', { award: data.award });
    }
}
