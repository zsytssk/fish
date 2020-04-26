import { Config } from 'data/config';
import { ServerErrCode, ServerEvent, ServerName } from 'data/serverEvent';
import AlertPop from 'view/pop/alert';
import {
    Config as SocketConfig,
    SocketEvent,
    WebSocketTrait,
} from '../net/webSocketWrap';
import {
    createSocket,
    disconnectSocket,
    getSocket,
} from '../net/webSocketWrapUtil';
import { log } from 'utils/log';

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
    platform.login();
    disconnectSocket(ServerName.Hall);
}
export function logout() {
    platform.logout();
    disconnectSocket(ServerName.Hall);
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
            socket.setParams({ jwt: token });
            resolve(socket);
            return;
        }

        /** 获取token */
        /** 游客的token */
        token = await getGuestToken(socket);
        socket.setParams({ jwt: token });
        Config.token = token;
        log('我自己的token:', token);
        resolve(socket);
    }) as Promise<WebSocketTrait>;
}
export function onSocketCreate(name: string) {}

export function getGuestToken(socket: WebSocketTrait) {
    return new Promise((resolve, reject) => {
        socket.event.once(ServerEvent.GetGuestToken, (token: string) => {
            resolve(token);
        });
        socket.send(ServerEvent.GetGuestToken);
    }) as Promise<string>;
}
