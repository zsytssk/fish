import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';

import { ui } from '@app/ui/layaMaxUI';
import { onNodeWithAni } from '@app/utils/layaUtils';

export default class ArenaHelpPop
    extends ui.pop.arenaHelp.arenaHelpUI
    implements HonorDialog
{
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
        const { btn_close } = this;
        onNodeWithAni(btn_close, Event.CLICK, () => {
            this.close();
        });
    }
}
