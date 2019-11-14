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
import { coingameLogout } from 'coingame/coingameUtil';

/** 登陆用的脚本 */
export async function login() {
    let socket = getSocket(ServerName.Hall);
    if (socket) {
        return true;
    }
    socket = await connectSocket(getHallSocketInfo());
    return true;
}

export function loginOut() {
    localStorage.removeItem('token');
    disconnectSocket(ServerName.Hall);
    coingameLogout();
}

export async function waitConnectGame() {
    let socket = getSocket(ServerName.Game);
    if (socket) {
        return socket;
    }
    socket = await enterGame(Config.SocketUrl);
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
    const code = localStorage.getItem('code');
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
    return new Promise((resolve, reject) => {
        const socket = createSocket(config);

        waitTokenExpire(socket, () => {
            socket.disconnect();
            AlertPop.alert('登陆断开, 收否刷新页面!').then(type => {
                if (type === 'confirm') {
                    location.reload();
                }
            });
        });
        const token = localStorage.getItem('token');
        if (token) {
            socket.setParams({ jwt: token });
            socket.event.once(SocketEvent.Init, () => {
                resolve(socket);
            });
            return;
        }

        /** 获取token */
        socket.event.once(SocketEvent.GetToken, async (jwt: string) => {
            /** 游客的token */
            if (!jwt) {
                jwt = await getGuestToken(socket);
            }
            socket.setParams({ jwt });
            localStorage.setItem('token', jwt);
            resolve(socket);
        });
    }) as Promise<WebSocketTrait>;
}

export function getGuestToken(socket: WebSocketTrait) {
    return new Promise((resolve, reject) => {
        socket.event.once(ServerEvent.GetGuestToken, (token: string) => {
            resolve(token);
        });
        socket.send(ServerEvent.GetGuestToken);
    }) as Promise<string>;
}

export function waitTokenExpire(socket: WebSocketTrait, callback: FuncVoid) {
    const { ErrCode } = ServerEvent;
    const fn = ({ code }: { code: string }) => {
        if (code === ServerErrCode.TokenExpire) {
            localStorage.removeItem('token');
            socket.event.off(ErrCode, fn, socket);
            callback();
        }
    };
    socket.event.on(ErrCode, fn, socket);
}
