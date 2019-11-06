import { AppCtrl } from 'ctrl/appCtrl';
import coingame from 'coingame.min.test';

coingame.sys.init(
    {
        origin: 'https://testing-bitfish.cointest.link/getDomain',
        host: 'testing-bitfish.cointest.link',
        success: () => {
            const logged = coingame.account.checkLogged();
            if (logged) {
                new AppCtrl(); //tslint:disable-line
            }
        },
    },
    {
        sso: `web-sp-inte1.dae.org`,
        protocol: 'https:',
        loginUrl:
            '/events/games/login.html?client_id={clientId}&redirect_uri={redirectUrl}',
    },
);
