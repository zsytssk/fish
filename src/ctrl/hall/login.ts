import { Config } from '@app/data/config';
import { isProd } from '@app/data/env';
import { ServerErrCode, ServerEvent, ServerName } from '@app/data/serverEvent';
import { getItem, setItem } from '@app/utils/localStorage';
import { log } from '@app/utils/log';
import { getParams, tplStr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';

import { Config as SocketConfig, WebSocketTrait } from '../net/webSocketWrap';
import {
    createSocket,
    disconnectSocket,
    getSocket,
} from '../net/webSocketWrapUtil';

/** 登陆用的脚本 */
export function login() {
    if (getParams('c') === 'YSTAR') {
        platform.register();
    } else {
        platform.login();
    }
}
export function logout() {
    platform.logout();
}

export async function waitConnectGame(url: string) {
    let socket = getSocket(ServerName.Game);
    if (socket) {
        return socket;
    }
    socket = await enterGame(url || Config.SocketUrl);
    socket.send(ServerEvent.EnterGame);
}

export async function enterGame(url: string) {
    const name = ServerName.Game;
    const { PublicKey: publicKey, Host: host } = Config;
    return await connectSocket({
        url,
        publicKey,
        name,
        host,
    });
}
export function leaveGame() {
    disconnectSocket(ServerName.Game);
}

export async function connectSocket(
    config: SocketConfig,
): Promise<WebSocketTrait> {
    const socket = await createSocket(
        config,
        isProd() ? 3 : 1,
        isProd() ? 3 : 0,
    );
    if (!socket && isProd()) {
        AlertPop.alert(tplStr(ServerErrCode.NetError)).then(() => {
            location.reload();
        });
        return;
    }

    const token = Config.token;
    if (token) {
        socket.setParams({ jwt: token, userId: getParams('userId') });
        return socket;
    }

    /** 获取 本地保存的 token */
    let local_token = getItem('local_token');
    if (!local_token) {
        local_token = await getGuestToken(socket);
        setItem('local_token', local_token, 7);
    }
    /** 游客的token */
    socket.setParams({ jwt: local_token, userId: getParams('userId') });
    log('本地guess token:', local_token);
    return socket;
}

export function getGuestToken(socket: WebSocketTrait) {
    return new Promise((resolve, _reject) => {
        socket.event.once(ServerEvent.GetGuestToken, (res: { jwt: string }) => {
            resolve(res.jwt);
        });
        socket.send(ServerEvent.GetGuestToken);
    }) as Promise<string>;
}
