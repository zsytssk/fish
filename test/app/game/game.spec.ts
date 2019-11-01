import { ctrlState } from 'ctrl/ctrlState';
import { GameCtrl } from 'ctrl/game/gameCtrl';
import { HallCtrl } from 'ctrl/start/hallCtrl';
import { injectAfter } from 'honor/utils/tool';
import { Test } from 'testBuilder';
import { fish_test } from './fish.spec';
import { player_test } from './player.spec';

export const game_test = new Test('game', runner => {
    runner.describe('enter_game', () => {
        injectAfter(HallCtrl, 'preEnter', () => {
            ctrlState.app.enterGame();
        });
        let running = false;
        injectAfter(GameCtrl, 'preEnter', () => {
            if (running) {
                return;
            }
            running = true;
            player_test.runTest('add_cur_player');
            // fish_test.runTest('add_fish_group', ['21', '1']);
            fish_test.runTest('add_fish_group', ['20', '1']);
            // socket_test.runTest('connect');
            // path_test.runTest('sprite_offset');
        });
    });
});
