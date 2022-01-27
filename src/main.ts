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
    const testUrl = getParams('arenaSocket');
    if (testUrl) {
        Config.arenaSocketUrl = testUrl;
    }

    Config.lang = convertLang(getParams('lang') || platform_info.lang) as Lang;
}

export function convertLang(lang: string) {
    if (Object.values(Lang).indexOf(lang as any) !== -1) {
        return lang;
    }
    return 'en';
}
