import { Honor } from 'honor';
import { mapTest, Test } from 'testBuilder';
import { TestBuilderCtor } from 'testBuilder/testBuilder';
import { getTestEnable, getTestIgnore } from './utils/testUtils';
import { game_test } from './app/game/game.spec';
import { app_test } from './app/app.spec';
import { fish_test } from './app/game/fish.spec';
import { player_test } from './app/game/player.spec';
import { body_test } from './app/game/body.spec';
import { count_test } from './count.spec';
import { modelState } from 'model/modelState';
import { ctrlState } from 'ctrl/ctrlState';
import { skill_test } from './app/game/skill.spec';
import { viewState } from 'view/viewState';
import { injectAfter } from 'honor/utils/tool';
import { GameCtrl } from 'ctrl/game/gameCtrl';
import { socket_test } from './app/socket.spec';
import { sat_test } from './sat.spec';
import { ani_wrap } from './app/game/aniWrap.spec';
declare global {
    interface Window {
        test: typeof test;
        Honor: typeof Honor;
        modelState: typeof modelState;
        ctrlState: typeof ctrlState;
        viewState: typeof viewState;
    }
}

const testScope = new Test('top');
testScope.addChild(
    game_test,
    app_test,
    fish_test,
    player_test,
    body_test,
    count_test,
    skill_test,
    socket_test,
    sat_test,
    ani_wrap,
);
const testBuilder = new TestBuilderCtor(testScope, { is_on: true });
testBuilder.enableDisableTest(getTestEnable(), getTestIgnore());
testBuilder.init();

export const test = mapTest(testBuilder.top_scope);
window.test = test;
window.test = test;
window.modelState = modelState;
window.ctrlState = ctrlState;
window.viewState = viewState;
window.Honor = Honor;

let running = false;
injectAfter(GameCtrl, 'preEnter', () => {
    if (running) {
        return;
    }
    running = true;
    player_test.runTest('add_cur_player');
    fish_test.runTest('add_fish', ['20']);
    // socket_test.runTest('connect');
});
