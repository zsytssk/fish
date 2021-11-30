import { Config } from '@app/data/config';
import { ServerEvent, ServerName } from '@app/data/serverEvent';
import { getItem, setItem } from '@app/utils/localStorage';
import { log } from '@app/utils/log';
import { getParams } from '@app/utils/utils';

import { Config as SocketConfig, WebSocketTrait } from '../net/webSocketWrap';
import {
    createSocket,
    disconnectSocket,
    getSocket,
} from '../net/webSocketWrapUtil';

/** 登陆用的脚本 */
export async function initHallSocket() {
    let socket = getSocket(ServerName.Hall);
    if (socket) {
        return true;
    }
    socket = await connectSocket(getHallSocketInfo());
    return true;
}

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

export function getHallSocketInfo(): SocketConfig {
    const code = Config.code;
    const name = ServerName.Hall;
    const { SocketUrl: url, PublicKey: publicKey, Host: host } = Config;

    return {
        url,
        name,
        publicKey,
        code,
        host,
    };
}

export function connectSocket(config: SocketConfig) {
    return new Promise(async (resolve, reject) => {
        const socket = await createSocket(config);

        let token = Config.token;
        if (token) {
            socket.setParams({ jwt: token, userId: getParams('userId') });
            resolve(socket);
            return;
        }

        /** 获取 本地保存的 token */
        token = getItem('local_token');
        if (!token) {
            token = await getGuestToken(socket);
            setItem('local_token', token, 7);
        }
        /** 游客的token */
        socket.setParams({ jwt: token, userId: getParams('userId') });
        Config.token = token;
        log('我自己的token:', token);
        resolve(socket);
    }) as Promise<WebSocketTrait>;
}
export function onSocketCreate(name: string) {}

export function getGuestToken(socket: WebSocketTrait) {
    return new Promise((resolve, reject) => {
        socket.event.once(ServerEvent.GetGuestToken, (res: { jwt: string }) => {
            resolve(res.jwt);
        });
        socket.send(ServerEvent.GetGuestToken);
    }) as Promise<string>;
}
