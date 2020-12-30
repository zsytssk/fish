import { ctrlState } from 'ctrl/ctrlState';
import { GameCtrl } from 'ctrl/game/gameCtrl';
import { HallCtrl } from 'ctrl/hall/hallCtrl';
import { injectAfter } from 'honor/utils/tool';
import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { GameTestCtrl } from 'ctrl/game/gameTest/gameTestCtrl';
import { sleep } from 'utils/animate';

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

export const game_test = new Test('game', runner => {
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
