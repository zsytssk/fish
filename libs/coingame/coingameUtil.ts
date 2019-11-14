import coingame from './coingame.min';

export function showNav(lang: string) {
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

export function coingameLogin() {
    coingame.account.login();
}
export function coingameLogout() {
    coingame.account.logout();
}
export function updateLanguage(lang: string) {
    coingame.sys.updateLanguage(lang);
}

export function hideNav() {
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
