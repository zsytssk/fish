import { Config } from 'data/config';
import { Lang } from 'data/internationalConfig';
import { AppCtrl } from './ctrl/appCtrl';

import './polyfill';

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
