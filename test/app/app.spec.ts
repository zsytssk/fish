import { AppCtrl } from 'ctrl/appCtrl';
import { injectProto } from 'honor/utils/tool';
import { Test } from 'testBuilder';
import { GameCtrl } from 'ctrl/game/gameCtrl';

export const app_test = new Test('app', runner => {
    runner.describe('enter_game', () => {});
});
