import { AppCtrl } from 'ctrl/appCtrl';
import coingame from 'coingame/coingame.min.test';
import { state } from 'data/env';

const { origin, host, env } = state;
const success = () => {
    const logged = coingame.account.checkLogged();
    if (logged) {
        new AppCtrl(); //tslint:disable-line
    }
};

const override =
    env === 'DEV'
        ? {
              sso: `web-sp-inte1.dae.org`,
              protocol: 'https:',
              loginUrl:
                  '/events/games/login.html?client_id={clientId}&redirect_uri={redirectUrl}',
          }
        : undefined;

coingame.sys.init(
    {
        origin,
        host,
        success,
    },
    override,
);
