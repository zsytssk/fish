import { Config } from '@app/data/config';
import { Lang } from '@app/data/internationalConfig';

import { AppCtrl } from './ctrl/appCtrl';
import './polyfill';
import { getParams } from './utils/utils';

function main() {
    init();
    new AppCtrl(); // tslint:disable-line
}
main();
export function init() {
    const platform_info = platform.getInfo();
    Config.SocketUrl = platform_info.socket_url;
    Config.token = platform_info.token;
    Config.isLogin = platform_info.isLogin;
    Config.cndUrl = platform_info.cdn;
    Config.arenaSocketUrl = getParams('arenaSocket')
        ? `ws://${getParams('arenaSocket')}`
        : 'ws://172.16.6.184:7019';
    Config.lang = (platform_info.lang || 'en') as Lang;
}
