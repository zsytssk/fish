import { Config } from 'data/config';
import { EnvState } from 'data/env';

const { origin, localTest } = EnvState;
if (!localTest) {
    import('coingame/coingame.min').then(sdkLoaded);
} else {
    import('coingame/coingame.min.test').then(sdkLoaded);
}
function sdkLoaded({ default: coingame }) {
    coingame.sys.init({
        origin,
        success: async () => {
            const logged = coingame.account.checkLogged();
            Config.SocketUrl = coingame.sys.config.api
                .replace('http://', '')
                .replace('https://', '');
            Config.Host = coingame.sys.config.domain;
            if (logged) {
                import('ctrl/appCtrl').then(({ AppCtrl }) => {
                    new AppCtrl(); // tslint:disable-line
                });
            }
        },
    });
}
