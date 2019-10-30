import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { injectAfter, injectProto } from 'honor/utils/tool';
import { GameCtrl } from 'ctrl/game/gameCtrl';
import { player_test } from './player.spec';
import { fish_test } from './fish.spec';
import { AppCtrl } from 'ctrl/appCtrl';
import { ctrlState } from 'ctrl/ctrlState';

export const game_test = new Test('game', runner => {
    runner.describe('enter_game', () => {
        injectProto(AppCtrl, 'startApp', () => {
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
            // fish_test.runTest('add_fish_group', ['20', '1']);
            // socket_test.runTest('connect');
            // path_test.runTest('sprite_offset');
        });
    });
});
