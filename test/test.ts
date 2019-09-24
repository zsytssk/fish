import { Honor } from 'honor';
import { mapTest, Test } from 'testBuilder';
import { TestBuilderCtor } from 'testBuilder/testBuilder';
import { getTestEnable, getTestIgnore } from './utils/testUtils';
import { game_test } from './game/game.spec';
declare global {
    interface Window {
        test: typeof test;
        Honor: typeof Honor;
    }
}

const testScope = new Test('top');
testScope.addChild(game_test);
const testBuilder = new TestBuilderCtor(testScope, { is_on: true });
testBuilder.enableDisableTest(getTestEnable(), getTestIgnore());
testBuilder.init();

export const test = mapTest(testBuilder.top_scope);
window.test = test;
window.Honor = Honor;
