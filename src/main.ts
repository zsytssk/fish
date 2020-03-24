import { Config } from 'data/config';
import { getParams } from 'utils/utils';

function init() {
    Config.SocketUrl = getParams('url');
    const code = getParams('code');
    if (code) {
        localStorage.setItem('code', code);
    }
}

import('ctrl/appCtrl').then(({ AppCtrl }) => {
    init();
    new AppCtrl(); // tslint:disable-line
});
