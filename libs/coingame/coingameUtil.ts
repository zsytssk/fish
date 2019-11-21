import coingame from './coingame.min';

export function coingameGetDomain() {
    return coingame.sys.config.domain;
}
export function coingameGetChannel() {
    return coingame.sys.config.channel;
}
export function coingameLogin() {
    coingame.account.login();
}
export function coingameLogout() {
    coingame.account.logout();
}
export function coingameUpdateLanguage(lang: string) {
    coingame.sys.updateLanguage(lang);
}

export function coingameHideNav() {
    // 游戏通用导航栏 隐藏
    coingame.checkComponents({
        list: ['nav'],
        success(res) {
            if (res.nav) {
                // 隐藏游戏通用导航栏
                coingame.comps.nav.hide();
            }
        },
    });
}

export function coingameShowNav(lang: string) {
    coingame.checkComponents({
        list: ['nav'],
        success(res) {
            if (res.nav) {
                // 初始化游戏通用导航栏
                coingame.comps.nav.init({ lang });

                // 显示游戏通用导航栏
                coingame.comps.nav.show();
            }
        },
    });
}

/** 充值 */
export function coingameCharge(currency: string, lang: string) {
    const data = {
        currency,
        lang,
    };
    coingame.pay.request({
        type: '1',
        // channel: coingameGetChannel(),
        data,
    } as any);
}
/** 提币 */
export function coingameWithDraw(currency: string, lang: string) {
    const data = {
        currency,
        lang,
    };

    coingame.pay.request({
        type: '0',
        // channel: coingameGetChannel(),
        data,
    } as any);
}
/** 提币 */
export function coingameHome() {
    coingame.account.home();
}
/** 提币 */
export function coingameApp() {
    coingame.account.app();
}
