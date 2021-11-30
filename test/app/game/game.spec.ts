import { Test } from 'testBuilder';

import { injectAfter } from 'honor/utils/tool';

import { ctrlState } from '@app/ctrl/ctrlState';
import { GameCtrl } from '@app/ctrl/game/gameCtrl';
import { GameTestCtrl } from '@app/ctrl/game/gameTest/gameTestCtrl';
import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { modelState } from '@app/model/modelState';
import { sleep } from '@app/utils/animate';

const a = {
    b() {
        return sleep(3).then(() => {
            console.log(`injectAfter:>`, 1);
            return sleep(3).then(() => {
                console.log(`injectAfter:>`, 2);
            });
        });
    },
};

export const game_test = new Test('game', (runner) => {
    runner.describe('enter_game', (add_player?: boolean) => {
        return new Promise((resolve, reject) => {
            if (modelState && modelState.app && modelState.app.game) {
                return resolve();
            }
            injectAfter(HallCtrl, 'preEnter', () => {
                setTimeout(() => {
                    ctrlState.app.enterGame({});
                });
            });
            // injectAfter(a, 'b', () => {
            //     setTimeout(() => {
            //         ctrlState.app.enterGame('test');
            //     });
            // });
            // a.b();

            if (!add_player) {
                return resolve();
            }

            let running = false;
            injectAfter(GameCtrl, 'preEnter', async () => {
                await sleep(1);
                if (running) {
                    resolve();
                    return;
                }
                running = true;
                resolve();
            });
        });
    });
    runner.describe('enter_game_test', (add_player?: boolean) => {
        GameTestCtrl.preEnter();
    });
});
