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
export function coingameCharge(data: any) {
    return new Promise((resolve, reject) => {
        coingame.pay.request({
            type: 1,
            channel: coingameGetChannel(),
            data,
            success: (rep: any) => {
                resolve(rep);
            },
            error: (rep: any) => {
                reject(rep);
            },
            complete: (rep: any) => {
                console.log(rep);
            },
        });
    });
}
/** 提币 */
export function coingameWithDraw(data: any) {
    return new Promise((resolve, reject) => {
        coingame.pay.request({
            type: 1,
            channel: coingameGetChannel(),
            data,
            success: (rep: any) => {
                resolve(rep);
            },
            error: (rep: any) => {
                reject(rep);
            },
            complete: (rep: any) => {
                console.log(rep);
            },
        });
    });
}
/** 提币 */
export function coingameHome() {
    coingame.account.home();
}
/** 提币 */
export function coingameApp() {
    coingame.account.app();
}
