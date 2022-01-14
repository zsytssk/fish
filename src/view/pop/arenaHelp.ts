import honor, { HonorDialog } from 'honor';
import { Label } from 'laya/ui/Label';
import { Handler } from 'laya/utils/Handler';

import { GetRuleData } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { offLangChange, onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { getAllChildren } from '@app/utils/layaQueryElements';
import { resizeContain } from '@app/utils/layaUtils';
import { calcPercent, tplIntr } from '@app/utils/utils';

export default class ArenaHelpPop
    extends ui.pop.arenaHelp.arenaHelpUI
    implements HonorDialog
{
    public static async preEnter(data: GetRuleData) {
        const pop = await honor.director.openDialog<ArenaHelpPop>(
            'pop/arenaHelp/arenaHelp.scene',
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
        const { title, tab0, tab1, tab2, tab3 } = this;
        title.text = tplIntr('arenaHelpTitle');
        tab0.label = tplIntr('arenaHelpTab0');
        tab1.label = tplIntr('arenaHelpTab1');
        tab2.label = tplIntr('arenaHelpTab2');
        tab3.label = tplIntr('arenaHelpTab3');
    }
    private initEvent() {
        const { tab, tabBody } = this;

        tab.selectHandler = new Handler(
            this,
            (index: number) => {
                tabBody.selectedIndex = index;
            },
            null,
            false,
        );
    }
    public async initData(data: GetRuleData) {
        const { tabBody } = this;
        try {
            const boxList = await getAllChildren(tabBody);
            const {
                roomConfig: { freeNum },
                globalConfig: {
                    initBulletNum,
                    rankingScoreDown,
                    skinBulletAddition: {
                        '1001': gun1001,
                        '1002': gun1002,
                        '1003': gun1003,
                        '1004': gun1004,
                        '1005': gun1005,
                    },
                },
                matchTimeConfig: { deadlineTime },
            } = data;

            const labels1 = getAllChildren(boxList[0]) as Label[];
            labels1[0].text = tplIntr('arenaHelpRule11', { deadlineTime });
            labels1[1].text = tplIntr('arenaHelpRule12', { freeNum });
            labels1[2].text = tplIntr('arenaHelpRule13');
            resizeContain(boxList[0], 10, 'vertical');

            const labels2 = getAllChildren(boxList[1]) as Label[];
            labels2[0].text = tplIntr('arenaHelpRule21', { initBulletNum });
            labels2[1].text = tplIntr('arenaHelpRule22', {});
            labels2[2].text = tplIntr('arenaHelpRule23', {});
            labels2[3].text = tplIntr('arenaHelpRule24', {});
            resizeContain(boxList[1], 10, 'vertical');

            const labels3 = getAllChildren(boxList[2]) as Label[];
            labels3[0].text = tplIntr('arenaHelpRule31', { rankingScoreDown });
            labels3[1].text = tplIntr('arenaHelpRule32', {});
            labels3[2].text = tplIntr('arenaHelpRule33', {});
            labels3[3].text = tplIntr('arenaHelpRule34', {});
            labels3[4].text = tplIntr('arenaHelpRule35', {});
            resizeContain(boxList[2], 10, 'vertical');

            const labels4 = getAllChildren(boxList[3]) as Label[];
            labels4[0].text = tplIntr('arenaHelpRule41', {});
            labels4[1].text = tplIntr('arenaHelpRule42', {
                gun1001: calcPercent(gun1001),
                gun1002: calcPercent(gun1002),
                gun1003: calcPercent(gun1003),
                gun1004: calcPercent(gun1004),
                gun1005: calcPercent(gun1005),
            });
            resizeContain(boxList[3], 10, 'vertical');
        } catch {}
    }
    public destroy() {
        offLangChange(this);
    }
}
