import { AppCtrl } from 'ctrl/appCtrl';
import coingame from 'coingame.min.test';

const code = `c3392c356cc746e3b845632ac9753f05`;

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
