import { ctrlState } from 'ctrl/ctrlState';
import honor from 'honor';
import { modelState } from 'model/modelState';
import { mapTest, Test } from 'testBuilder';
import { TestBuilderCtor } from 'testBuilder/testBuilder';
import { viewState } from 'view/viewState';
import { app_test } from './app/app.spec';
import { ani_wrap } from './app/game/aniWrap.spec';
import { body_test } from './app/game/body.spec';
import { fish_test } from './app/game/fish.spec';
import { game_test } from './app/game/game.spec';
import { player_test } from './app/game/player.spec';
import { skill_test } from './app/game/skill.spec';
import { hall_test } from './app/hall/hall.spec';
import { path_test } from './app/path.spec';
import { socket_test } from './app/socket.spec';
import { count_test } from './count.spec';
import { sat_test } from './sat.spec';
import {
    getTestEnable,
    getTestIgnore,
    stageClick,
    onCreateInstance,
} from './utils/testUtils';
import { alert_test } from './app/pop/alert.spec';
import { web_socket_test } from './app/websocket.spec';
import { laya_test } from './laya.spec';
import { shop_test } from './app/pop/shop.spec';
import { injectAfter, injectProto } from 'honor/utils/tool';
import { AppCtrl } from 'ctrl/appCtrl';
import { lottery_test } from './app/pop/lottery.spec';
import { voice_test } from './app/pop/voice.spec';

type TestUtils = {
    stageClick: typeof stageClick;
    honor: typeof honor;
    modelState: typeof modelState;
    ctrlState: typeof ctrlState;
    viewState: typeof viewState;
};
declare global {
    interface Window {
        test: typeof test;
        testUtils: TestUtils;
    }
}

const testScope = new Test('top');
testScope.addChild(
    ani_wrap,
    app_test,
    body_test,
    count_test,
    fish_test,
    game_test,
    hall_test,
    path_test,
    player_test,
    sat_test,
    skill_test,
    socket_test,
    alert_test,
    web_socket_test,
    laya_test,
    shop_test,
    lottery_test,
    voice_test,
);
const testBuilder = new TestBuilderCtor(testScope, { is_on: true });
testBuilder.enableDisableTest(getTestEnable(), getTestIgnore());
testBuilder.init();

export const test = mapTest(testBuilder.top_scope);
window.test = test;
window.testUtils = { stageClick, modelState, ctrlState, viewState, honor };

// injectProto(AppCtrl, 'startApp', () => {
//     voice_test.runTest('open_dialog');
// });
game_test.runTest('enter_game');
// socket_test.runTest('init_app_socket');
