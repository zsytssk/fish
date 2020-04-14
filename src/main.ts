import { Config } from 'data/config';

export function init() {
    const platform_info = platform.getInfo();
    Config.SocketUrl = platform_info.socket_url;
    Config.token = platform_info.token;
    Config.isLogin = platform_info.isLogin;
}

import('ctrl/appCtrl').then(({ AppCtrl }) => {
    init();
    new AppCtrl(); // tslint:disable-line
});
