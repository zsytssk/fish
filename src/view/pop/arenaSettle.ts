import honor, { HonorDialog } from 'honor';

import { ui } from '@app/ui/layaMaxUI';

export default class ArenaSettlePop
    extends ui.pop.arenaSettle.arenaSettleUI
    implements HonorDialog
{
    public isModal = true;
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: ArenaSettlePop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaSettlePop;

        return pop;
    }
}
