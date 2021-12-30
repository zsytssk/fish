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
        ? 'ws://${getParams("arenaSocket")}'
        : 'ws://172.16.6.184:7019';
    Config.lang = covertLang(platform_info.lang);
}

export function covertLang(ori_lang: string) {
    const save_lang = ori_lang;
    let lang: Lang = Lang.En;
    if (save_lang === 'en') {
        lang = 'en' as Lang;
    } else if (save_lang === 'zh-Hant') {
        lang = 'hk' as Lang;
    } else if (save_lang === 'zh-Hans') {
        lang = 'zh' as Lang;
    } else if (save_lang === 'ja') {
        lang = 'jp' as Lang;
    } else if (save_lang === 'ko') {
        lang = 'kor' as Lang;
    }
    return lang;
}
