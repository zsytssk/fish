//-----libs-begin-----

//-----libs-end-------
// // 游戏启动
paladin.checkComponents({
    list: ['launch'],
    success(res) {
        if (res.launch) {
            paladin.comps.launch.show({
                design: { width: 1334, height: 750, mode: 'horizontal' },
                logo: { url: './bitgame/logo.png' },
                load: { color: '#6d8ac8' },
                tips: { color: '#6d8ac8' },
                notice: { color: '#6d8ac8' },
            });
        }
    },
});

window.screenOrientation = 'sensor_landscape';
// 游戏初始化
paladin.init({
    url:
        'http://47.101.172.184:8103/platform/game/domains?host=47.101.172.184:8001',
    files: ['./js/bundle.js?v=' + CDN_VERSION],
    loadType: 2,
    success: function (res) {},
});

var platform = {
    hideLoading() {
        paladin.comps.launch.hide();
    },
    login() {
        paladin.account.login();
    },
    logout() {
        paladin.account.logout();
    },
    getInfo() {
        return {
            isLogin: paladin.sys.config.isLogin,
            token: paladin.sys.config.jwtToken,
            lang: paladin.sys.config.lang,
            socket_url: paladin.sys.config.ws,
        };
    },
};

// loadLib('./js/bundle.js?v=' + CDN_VERSION);
// var platform = {
//     hideLoading() {},
//     login() {},
//     logout() {},
//     getInfo() {
//         return {
//             isLogin: true,
//             token: '',
//             socket_url: '',
//         };
//     },
// };
