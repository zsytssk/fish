import { ctrlState } from 'ctrl/ctrlState';
import honor from 'honor';
import { modelState } from 'model/modelState';
import { viewState } from 'view/viewState';
import { showNodeZone, stageClick, injectWindow } from './utils/testUtils';
import { test } from './testBuilder';
import { localHaveSocketTest, localTest } from './app/testEnv';

const testUtils = {
    showNodeZone,
    stageClick,
};

injectWindow({ test, testUtils, modelState, ctrlState, viewState, honor });
localHaveSocketTest();
// localTest();
