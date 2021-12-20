import honor, { HonorDialog } from 'honor';
import { Handler } from 'laya/utils/Handler';

import { ui } from '@app/ui/layaMaxUI';

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
}
