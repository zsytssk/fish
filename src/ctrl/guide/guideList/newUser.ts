import honor from 'honor';
import HallView from 'view/scenes/hallView';
import { showPromptByNode } from '../core/guideUtils';

export class NewUserGuide {
    public async start(guide_group: string) {
        await this.showStartPrompt();
    }

    public async showStartPrompt() {
        const cur_scene = honor.director.runningScene as HallView;
        if (!(cur_scene instanceof HallView)) {
            return;
        }
        const {
            header: { btn_coin_select },
        } = cur_scene;

        await showPromptByNode(
            btn_coin_select,
            ['1.点击下拉按钮选择币种'],
            'bottom',
            true,
        );
    }
}
