import { Test, mapTest } from 'testBuilder';
import { TestBuilderCtor } from 'testBuilder/testBuilder';
import { getTestEnable, getTestIgnore } from './utils/testUtils';
import dialogSpec from './dialog.spec';
import sceneSpec from './scene.spec';
import { Honor } from 'honor';
declare global {
    interface Window {
        test: typeof test;
        Honor: typeof Honor;
    }
}

const testScope = new Test('top');
testScope.addChild(dialogSpec, sceneSpec);
const testBuilder = new TestBuilderCtor(testScope, { is_on: true });
testBuilder.enableDisableTest(getTestEnable(), getTestIgnore());
testBuilder.init();

export const test = mapTest(testBuilder.top_scope);
window.test = test;
window.Honor = Honor;
