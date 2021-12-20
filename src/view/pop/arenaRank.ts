import honor, { HonorDialog } from 'honor';

import { ui } from '@app/ui/layaMaxUI';

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

        return pop;
    }
}
