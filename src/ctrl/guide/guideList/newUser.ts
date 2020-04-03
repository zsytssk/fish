import { HallCtrl } from 'ctrl/hall/hallCtrl';
import { showPromptByNode } from '../core/guideUtils';
import { sleep } from 'utils/animate';
import { guide_state } from '../guideState';
import { PromptPos } from '../core/prompt';
import { waitCreateSocket } from '../../net/webSocketWrapUtil';
import { ServerName } from 'data/serverEvent';
import { GameTestCtrl } from '../../game/gameTest/gameTestCtrl';
import {
    genFishInfo,
    mockShoot,
    resetMockSocketCtor,
} from 'ctrl/game/gameTest/utils';

export class NewUserGuide {
    public async start(guide_group: string) {
        await this.showStartPrompt();
    }

    public async showStartPrompt() {
        const { guide_dialog } = guide_state;

        const hall_ctrl = await HallCtrl.preEnter();
        if (!(hall_ctrl instanceof HallCtrl)) {
            return;
        }

        await waitCreateSocket(ServerName.Hall);
        await sleep(1);
        const {
            header: { btn_coin_select },
            guide2,
        } = hall_ctrl.view;
        await sleep(1);

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

        // const game_ctrl = await hall_ctrl.roomIn({ isTrial: 0, roomId: 1 });
        const game_ctrl = await GameTestCtrl.preEnter();

        const { bullet_box } = game_ctrl.view;
        await sleep(1);
        const dir: PromptPos = bullet_box.x > 1334 / 2 ? 'left' : 'right';
        guide_dialog.setBtnNextDir(dir);
        await showPromptByNode(
            bullet_box,
            [
                '进入正式场后，系统会自动将您的数字货币兑换成子弹，请放心， 在您离开房间后，所有剩余子弹将会再兑换成您的数字货币',
            ],
            dir,
            true,
        );

        const { skill_box } = game_ctrl.view;
        await sleep(1);
        guide_dialog.setBtnNextDir('right');
        await showPromptByNode(
            skill_box,
            ['可以使用道具，帮助您捕获更多更大的鱼'],
            dir,
            true,
        );

        const player_ctrl = [...game_ctrl.player_list][0];
        const cur_gun = player_ctrl.view;
        await sleep(1);
        await showPromptByNode(
            cur_gun,
            ['控制您的炮台，点击并捕捉鱼，获得更多子弹'],
            dir,
            true,
        );
        sleep(2);
        genFishInfo(game_ctrl);

        const fish = game_ctrl.fish_view;
        await showPromptByNode(
            fish,
            ['点击屏幕发射子弹，捕捉鱼群，获得更多子弹'],
            'right',
            true,
            'point',
        );

        await mockShoot();

        const { btn_start } = guide_dialog;
        btn_start.visible = true;
        await sleep(0.5);
        await showPromptByNode(
            btn_start,
            ['点击屏幕发射子弹，捕捉鱼群，获得更多子弹, 开始游戏吧'],
            'left',
            true,
            'start',
        );
        resetMockSocketCtor(game_ctrl);
        await hall_ctrl.roomIn({ isTrial: 1, roomId: 1 });
    }
}
