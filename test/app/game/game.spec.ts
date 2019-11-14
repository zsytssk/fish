import { ctrlState } from 'ctrl/ctrlState';
import { GameCtrl } from 'ctrl/game/gameCtrl';
import { HallCtrl } from 'ctrl/hall/hallCtrl';
import { injectAfter } from 'honor/utils/tool';
import { Test } from 'testBuilder';
import { fish_test } from './fish.spec';
import { player_test } from './player.spec';
import { modelState } from 'model/modelState';
import { mock_web_socket_test } from '../socket/mockSocket/mockWebsocket.spec';
import { ServerEvent } from 'data/serverEvent';

export const game_test = new Test('game', runner => {
    runner.describe('enter_game', (add_player?: boolean) => {
        return new Promise((resolve, reject) => {
            if (modelState && modelState.app && modelState.app.game) {
                return resolve();
            }
            injectAfter(HallCtrl, 'preEnter', () => {
                ctrlState.app.enterGame();
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
