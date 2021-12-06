import { testBuild } from 'testBuilder';

import { injectAfter } from 'honor/utils/tool';

import { ctrlState } from '@app/ctrl/ctrlState';
import { GameCtrl as GrandPrixCtrl } from '@app/ctrl/grandPrix/gameCtrl';
import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { modelState } from '@app/model/modelState';
import { sleep } from '@app/utils/animate';
import GrandPrixView from '@app/view/scenes/grandPrix/grandPrixView';
import { viewState } from '@app/view/viewState';

import * as taskData from './data/taskData.json';

export const grand_prix_test = testBuild({
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
            if (running) {
                return;
            }
            running = true;
        });

        await sleep(1);

        if (modelState.app.game) {
            modelState.app.game.setGameMode(2);
        }
    },
    showTask: async () => {
        const grandPrixView = viewState.game as GrandPrixView;

        grandPrixView.showTaskPanel(taskData);
        await sleep(3);
        grandPrixView.hideTaskPanel();
    },
    setPlayerNum: async () => {
        const game = viewState.game as GrandPrixView;
        game.setPlayerBulletNum('current', 1000);
        await sleep(1);
        game.setPlayerBulletNum('other', 1000);
        await sleep(1);
        game.setPlayerScore('current', 1000);
        await sleep(1);
        game.setPlayerScore('other', 1000);
    },
});
