import { ctrlState } from 'ctrl/ctrlState';
import honor from 'honor';
import { modelState } from 'model/modelState';
import { viewState } from 'view/viewState';
import { localSocketTest, localTest } from './app/localTest';
import { test } from './testBuilder';
import {
    getCurPlayer,
    getUserInfo,
    injectWindow,
    showNodeZone,
    stageClick,
} from './utils/testUtils';
import { getParams } from 'utils/utils';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';

const testUtils = {
    showNodeZone,
    stageClick,
    getCurPlayer,
    getUserInfo,
    getSocket,
};
injectWindow({ test, testUtils, modelState, ctrlState, viewState, honor });

if (getParams('localTest')) {
    localTest();
} else if (getParams('localSocketTest')) {
    localSocketTest();
}
