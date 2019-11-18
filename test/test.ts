import { ctrlState } from 'ctrl/ctrlState';
import honor from 'honor';
import { modelState } from 'model/modelState';
import { viewState } from 'view/viewState';
import {
    showNodeZone,
    stageClick,
    injectWindow,
    getCurPlayer,
} from './utils/testUtils';
import { test } from './testBuilder';
import { localHaveSocketTest, localTest } from './app/testEnv';
import { state } from 'data/env';

const testUtils = {
    showNodeZone,
    stageClick,
    getCurPlayer,
};

injectWindow({ test, testUtils, modelState, ctrlState, viewState, honor });
if (state.localTest) {
    localTest();
} else {
    localHaveSocketTest();
}
