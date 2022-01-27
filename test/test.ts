import honor from 'honor';

import { ctrlState } from '@app/ctrl/ctrlState';
import { getSocket } from '@app/ctrl/net/webSocketWrapUtil';
import { modelState } from '@app/model/modelState';
import { getParams } from '@app/utils/utils';
import { viewState } from '@app/view/viewState';

import { localSocketTest, localTest, commonTest } from './app/localTest';
import { test } from './testBuilder';
import {
    getCurPlayer,
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
    getSocket,
};
injectWindow({ test, testUtils, modelState, ctrlState, viewState, honor });

if (getParams('localTest')) {
    localTest();
} else if (getParams('localSocketTest')) {
    localSocketTest();
} else {
    commonTest();
}
