import { testBuild } from 'testBuilder';

import { injectAfter } from 'honor/utils/tool';

import { ctrlState } from '@app/ctrl/ctrlState';
import { GameCtrl } from '@app/ctrl/game/gameCtrl';
import { GameTestCtrl } from '@app/ctrl/game/gameTest/gameTestCtrl';
import { GameCtrl as GrandPrixCtrl } from '@app/ctrl/grandPrix/gameCtrl';
import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { modelState } from '@app/model/modelState';
import { sleep } from '@app/utils/animate';
import GrandPrixView from '@app/view/scenes/grandPrix/grandPrixView';
import { viewState } from '@app/view/viewState';

export const game_test = testBuild({
    enter: async (add_player?: boolean) => {
        if (modelState?.app?.game) {
            return;
        }

        await injectAfter(HallCtrl, 'preEnter', () => {
            setTimeout(() => {
                ctrlState.app.enterGrandPrix({});
            });
        });

        if (!add_player) {
            return;
        }

        let running = false;
        await injectAfter(GrandPrixCtrl, 'preEnter', async () => {
            await sleep(1);
            if (running) {
                return;
            }
            running = true;
        });

        if (modelState.app.game) {
            modelState.app.game.setGameMode(2);
        }
    },
    showTask: async (add_player?: boolean) => {
        const grandPrixView = viewState.game as GrandPrixView;
        grandPrixView.showTaskPanel({});
    },
});
