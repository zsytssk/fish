import { ctrlState } from 'ctrl/ctrlState';
import honor from 'honor';
import { modelState } from 'model/modelState';
import { viewState } from 'view/viewState';
import {
    showNodeZone,
    stageClick,
    injectWindow,
    getCurPlayer,
    getUserInfo,
} from './utils/testUtils';
import { test } from './testBuilder';
import { localHaveSocketTest, localTest } from './app/testEnv';
import { EnvState } from 'data/env';

const testUtils = {
    showNodeZone,
    stageClick,
    getCurPlayer,
    getUserInfo,
};
injectWindow({ test, testUtils, modelState, ctrlState, viewState, honor });
if (EnvState.localTest) {
    localTest();
} else {
    // localHaveSocketTest();
}
