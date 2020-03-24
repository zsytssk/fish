import { ctrlState } from 'ctrl/ctrlState';
import { GameCtrl } from 'ctrl/game/gameCtrl';
import { HallCtrl } from 'ctrl/hall/hallCtrl';
import { injectAfter } from 'honor/utils/tool';
import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';

export const game_test = new Test('game', runner => {
    runner.describe('enter_game', (add_player?: boolean) => {
        return new Promise((resolve, reject) => {
            if (modelState && modelState.app && modelState.app.game) {
                return resolve();
            }
            injectAfter(HallCtrl, 'preEnter', () => {
                setTimeout(() => {
                    ctrlState.app.enterGame('test');
                });
            });

            if (!add_player) {
                return resolve();
            }

            let running = false;
            injectAfter(GameCtrl, 'preEnter', () => {
                if (running) {
                    resolve();
                    return;
                }
                running = true;
                resolve();
            });
        });
    });
});
