import 'coingame.min.js';

declare const coingame: any;
export function login() {
    return new Promise((resolve, reject) => {
        coingame.sys.init({
            callback: () => {
                // 检查登录态
                const logged = coingame.account.checkLogged();

                // 加载游戏引擎
                if (logged) {
                    resolve();
                } else {
                    reject();
                }
            },
        });

        // @test
        resolve();
    });
}
