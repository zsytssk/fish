import honor, { HonorDialog } from 'honor';

import { ui } from '@app/ui/layaMaxUI';

export default class ArenaGiftPop
    extends ui.pop.arenaGift.arenaGiftUI
    implements HonorDialog
{
    public isModal = true;
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: ArenaGiftPop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaGiftPop;

        return pop;
    }
}
