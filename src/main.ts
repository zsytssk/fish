import { Config } from 'data/config';
import { getParams } from 'utils/utils';

function init() {
    Config.SocketUrl = getParams('url');
}

import('ctrl/appCtrl').then(({ AppCtrl }) => {
    init();
    new AppCtrl(); // tslint:disable-line
});
