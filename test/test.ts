import { ctrlState } from 'ctrl/ctrlState';
import honor from 'honor';
import { modelState } from 'model/modelState';
import { viewState } from 'view/viewState';
import { localHaveSocketTest, localTest } from './app/testEnv';
import { test } from './testBuilder';
import {
    getCurPlayer,
    getParams,
    getUserInfo,
    injectWindow,
    showNodeZone,
    stageClick,
} from './utils/testUtils';

const testUtils = {
    showNodeZone,
    stageClick,
    getCurPlayer,
    getUserInfo,
};
injectWindow({ test, testUtils, modelState, ctrlState, viewState, honor });

if (getParams('localTest')) {
    localTest();
} else if (getParams('enterGame')) {
    localHaveSocketTest();
}
