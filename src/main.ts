import { AppCtrl } from 'ctrl/appCtrl';
import coingame from 'coingame/coingame.min';
import { state } from 'data/env';
import { Config } from 'data/config';

const { origin, env } = state;
const success = () => {
    const logged = coingame.account.checkLogged();
    Config.SocketUrl = coingame.sys.config.api
        .replace('http://', '')
        .replace('https://', '');
    Config.Host = coingame.sys.config.domain;
    if (logged) {
        new AppCtrl(); //tslint:disable-line
    }
};

if (Config.localTest) {
    coingame.sys.init(
        {
            origin,
            success,
        },
        {
            sso: 'web-sp-inte1.dae.org',
            loginUrl:
                '/events/games/login.html?client_id={clientId}&redirect_uri={redirectUrl}',
        },
    );
} else {
    coingame.sys.init({
        origin,
        success,
    });
}
