import honor, { HonorDialog } from 'honor';
import { Label } from 'laya/ui/Label';
import { Handler } from 'laya/utils/Handler';

import { offLangChange, onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { ui } from '@app/ui/layaMaxUI';
import { getAllChildren } from '@app/utils/layaQueryElements';
import { resizeContain } from '@app/utils/layaUtils';
import { tplStr } from '@app/utils/utils';

import { arenaGetRuleData } from './popSocket';

export default class ArenaHelpPop
    extends ui.pop.arenaHelp.arenaHelpUI
    implements HonorDialog
{
    public isModal = true;
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: ArenaHelpPop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaHelpPop;

        return pop;
    }
    public async onAwake() {
        this.initEvent();
        onLangChange(this, () => {
            this.initLang();
        });
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
    private async initLang() {
        const { tabBody } = this;
        try {
            const boxList = await getAllChildren(tabBody);
            const {
                roomConfig: { freeNum },
                globalConfig: {
                    initBulletNum,
                    rankingScoreDown,
                    skinBulletAddition: {
                        1001: gun1001,
                        1002: gun1002,
                        1003: gun1003,
                        1004: gun1004,
                        1005: gun1005,
                    },
                },
                matchTimeConfig: { deadlineTime },
            } = arenaGetRuleData(1);

            const labels1 = getAllChildren(boxList[0]) as Label[];
            labels1[0].text = tplStr('arenaHelpRule11', { deadlineTime });
            labels1[1].text = tplStr('arenaHelpRule12', { freeNum });
            labels1[2].text = tplStr('arenaHelpRule13');
            resizeContain(boxList[0], 10, 'vertical');

            const labels2 = getAllChildren(boxList[1]) as Label[];
            labels2[0].text = tplStr('arenaHelpRule21', { initBulletNum });
            labels2[1].text = tplStr('arenaHelpRule22', {});
            labels2[2].text = tplStr('arenaHelpRule23', {});
            labels2[3].text = tplStr('arenaHelpRule24', {});
            resizeContain(boxList[1], 10, 'vertical');

            const labels3 = getAllChildren(boxList[2]) as Label[];
            labels3[0].text = tplStr('arenaHelpRule31', { rankingScoreDown });
            labels3[1].text = tplStr('arenaHelpRule32', {});
            labels3[2].text = tplStr('arenaHelpRule33', {});
            labels3[3].text = tplStr('arenaHelpRule34', {});
            labels3[4].text = tplStr('arenaHelpRule35', {});
            resizeContain(boxList[2], 10, 'vertical');

            const labels4 = getAllChildren(boxList[3]) as Label[];
            labels4[0].text = tplStr('arenaHelpRule41', {});
            labels4[1].text = tplStr('arenaHelpRule42', {
                gun1001,
                gun1002,
                gun1003,
                gun1004,
                gun1005,
            });
            resizeContain(boxList[3], 10, 'vertical');
        } catch {}
    }
    public destroy() {
        offLangChange(this);
    }
}
