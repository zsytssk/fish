import { injectAfter } from 'honor/utils/tool';

import { ctrlState } from '@app/ctrl/ctrlState';
import { GameCtrl } from '@app/ctrl/game/gameCtrl';
import { GameTestCtrl } from '@app/ctrl/game/gameTest/gameTestCtrl';
import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { modelState } from '@app/model/modelState';
import { sleep } from '@app/utils/animate';

export const game_test = {
    enterGame: async (add_player?: boolean) => {
        if (modelState && modelState.app && modelState.app.game) {
            return;
        }

        ctrlState.app.enterGame({});

        if (!add_player) {
            return;
        }

        let running = false;
        await injectAfter(GameCtrl, 'preEnter', async () => {
            await sleep(1);
            if (running) {
                return;
            }
            running = true;
        });
    },

    enterGameTest: () => {
        GameTestCtrl.preEnter();
    },
};
