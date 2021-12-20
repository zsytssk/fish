import honor, { HonorDialog } from 'honor';

import { ui } from '@app/ui/layaMaxUI';

export default class ArenaTopPlayerPop
    extends ui.pop.arenaTopPlayer.arenaTopPlayerUI
    implements HonorDialog
{
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: ArenaTopPlayerPop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaTopPlayerPop;

        return pop;
    }
}
