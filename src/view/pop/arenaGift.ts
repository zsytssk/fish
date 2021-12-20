import honor, { HonorDialog } from 'honor';

import { ui } from '@app/ui/layaMaxUI';

export default class ArenaHelpGiftPop
    extends ui.pop.arenaGift.arenaGiftUI
    implements HonorDialog
{
    public isModal = true;
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: ArenaHelpGiftPop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaHelpGiftPop;

        return pop;
    }
}
