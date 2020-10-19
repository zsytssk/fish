//-----libs-begin-----

//-----libs-end-------
paladin.checkComponents({
    list: ['launch'],
    success: function (res) {
        if (res.launch) {
            paladin.comps.launch.show({
                design: { width: 1334, height: 750, mode: 'horizontal' },
                logo: { url: 'bitgame/logo.png' },
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
    files: ['js/bundle.js?v=' + CDN_VERSION],
    loadType: 2,
    success: function (res) {},
});

var platform = {
    hideLoading: function () {
        paladin.comps.launch.hide();
    },
    login: function () {
        paladin.account.login();
    },
    logout: function () {
        paladin.account.logout();
    },
    getInfo: function () {
        return {
            isLogin: paladin.sys.config.isLogin,
            token: paladin.sys.config.jwtToken,
            lang: paladin.sys.config.lang,
            socket_url: paladin.sys.config.ws,
            cdn: paladin.sys.config.cdn,
        };
    },
    recharge: function (currency, gameNo) {
        paladin &&
            paladin.pay.recharge({
                data: {
                    currency: currency,
                    gameNo: gameNo,
                    isHorizontal: true, // 横屏游戏需要传递该参数，竖屏游戏可以不传递或者传递false
                },
            });
    },
};

// loadLib('./js/bundle.js?v=' + CDN_VERSION);
// var platform = {
//     hideLoading: function () {},
//     login: function () {},
//     logout: function () {},
//     getInfo: function () {
//         return {
//             isLogin: false,
//             token: '',
//             socket_url: 'ws://47.101.172.184:8101',
//         };
//     },
//     recharge: function () {
//     },
// };
