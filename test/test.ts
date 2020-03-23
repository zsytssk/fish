import { ctrlState } from 'ctrl/ctrlState';
import honor from 'honor';
import { modelState } from 'model/modelState';
import { viewState } from 'view/viewState';
import { localSocketTest, localTest } from './app/testEnv';
import { test } from './testBuilder';
import {
    getCurPlayer,
    getUserInfo,
    injectWindow,
    showNodeZone,
    stageClick,
} from './utils/testUtils';
import { Config } from 'data/config';
import { getParams } from 'utils/utils';

const testUtils = {
    showNodeZone,
    stageClick,
    getCurPlayer,
    getUserInfo,
};
injectWindow({ test, testUtils, modelState, ctrlState, viewState, honor });

if (getParams('localTest')) {
    localTest();
} else if (getParams('localSocketTest')) {
    localSocketTest();
}
