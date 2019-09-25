import { AppCtrl } from 'ctrl/app';
import { state } from 'ctrl/state';
import { injectProto } from 'honor/utils/tool';
import { Test } from 'testBuilder';
import { GameCtrl } from 'ctrl/game/gameCtrl';

declare global {
    interface Window {
        state: typeof state;
    }
}
export const app_test = new Test('app', runner => {
    injectProto(AppCtrl, 'startApp', () => {
        window.state = state;
        app_test.runTest('enter_game');
    });

    runner.describe('enter_game', () => {
        GameCtrl.preEnter();
    });
});
