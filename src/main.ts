import { Config } from 'data/config';
import { state } from 'data/env';

const { origin, localTest } = state;
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
                const { AppCtrl } = await import('ctrl/appCtrl');
                new AppCtrl(); // tslint:disable-line
            }
        },
    });
}
