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
import { getLang } from 'ctrl/hall/hallCtrlUtil';
import { InternationalTip } from 'data/internationalConfig';
import honor from 'honor';
import { error } from 'utils/log';

export class NewUserGuide {
    public async start(guide_group: string) {
        const completed = await this.showStartPrompt();
        if (completed) {
            await this.next();
        }
    }

    public async showStartPrompt() {
        const lang = getLang();
        const { tour1, tour2, tour3, tour4, tour5, tour6 } = InternationalTip[
            lang
        ];

        let game_ctrl: GameTestCtrl;
        try {
            const { guide_dialog } = guide_state;

            const hall_ctrl = HallCtrl.instance;
            if (!hall_ctrl) {
                return;
            }

            await waitCreateSocket(ServerName.Hall);
            const {
                header: { btn_coin_select },
                guide2,
            } = hall_ctrl.view;

            await showPromptByNode(btn_coin_select, [tour1], 'bottom', true);

            await showPromptByNode(guide2, [tour2], 'right', true);

            // const game_ctrl = await hall_ctrl.roomIn({ isTrial: 0, roomId: 1 });
            hall_ctrl.destroy();
            game_ctrl = await GameTestCtrl.preEnter();

            honor.director.openDialog(guide_dialog);
            const { bullet_box } = game_ctrl.view;
            await sleep(1);
            const dir: PromptPos = bullet_box.x > 1334 / 2 ? 'left' : 'right';
            guide_dialog.setBtnNextDir(dir);
            await showPromptByNode(bullet_box, [tour3], dir, true);

            const player_ctrl = [...game_ctrl.player_list][0];
            const cur_gun = player_ctrl.view;
            await sleep(1);
            await showPromptByNode(cur_gun, [tour4], dir, true);
            sleep(2);
            genFishInfo(game_ctrl);

            const fish = game_ctrl.fish_view;
            await showPromptByNode(
                { sprite: fish, shape: 'circle' },
                [tour5],
                'right',
                true,
                'point',
            );

            await mockShoot();

            await sleep(1);

            const { skill_box } = game_ctrl.view;
            guide_dialog.setBtnNextDir('right');
            await showPromptByNode(skill_box, [tour6], 'top', true, 'start');
            resetMockSocketCtor(game_ctrl);
            return true;
        } catch (err) {
            if (err === 'skip') {
                resetMockSocketCtor(game_ctrl);
                return true;
            } else {
                error(err);
            }
        }
    }
    private async next() {
        await HallCtrl.preEnter();
    }
}
