import { HallCtrl } from 'ctrl/hall/hallCtrl';
import { showPromptByNode } from '../core/guideUtils';

export class NewUserGuide {
    public async start(guide_group: string) {
        await this.showStartPrompt();
    }

    public async showStartPrompt() {
        const hall_ctrl = await HallCtrl.preEnter();
        if (!(hall_ctrl instanceof HallCtrl)) {
            return;
        }
        const {
            header: { btn_coin_select },
            guide2,
        } = hall_ctrl.view;

        await showPromptByNode(
            btn_coin_select,
            ['1.点击下拉按钮选择币种'],
            'bottom',
            true,
        );

        await showPromptByNode(
            guide2,
            ['2.选择币种不同<br/> 游戏房间也会随之切换'],
            'right',
            true,
        );

        await hall_ctrl.roomIn({ isTrial: 0, roomId: 1 });
    }
}
