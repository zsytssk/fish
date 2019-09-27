import { AppCtrl } from 'ctrl/appCtrl';
import { ctrlState } from 'ctrl/ctrlState';
import { injectProto } from 'honor/utils/tool';
import { Test } from 'testBuilder';
import { GameCtrl } from 'ctrl/game/gameCtrl';

declare global {
    interface Window {
        state: typeof ctrlState;
    }
}
export const app_test = new Test('app', runner => {
    injectProto(AppCtrl, 'startApp', () => {
        window.state = ctrlState;
        app_test.runTest('enter_game');
    });

    runner.describe('enter_game', () => {
        GameCtrl.preEnter();
    });
});
