import { getSocket, createSocket, disconnectSocket } from './webSocketWrapUtil';
import { ServerName, ServerEvent, ServerErrCode } from 'data/serverEvent';
import {
    Config as SocketConfig,
    SocketEvent,
    WebSocketTrait,
} from './webSocketWrap';
import { Config } from 'data/config';

/** 登陆用的脚本 */
export async function login() {
    let socket = getSocket(ServerName.Hall);
    if (socket) {
        return true;
    }
    socket = await connectSocket(getHallSocketInfo());
}

export function loginOut() {
    localStorage.removeItem('token');
    disconnectSocket(ServerName.Hall);
}

export function getHallSocketInfo(): SocketConfig {
    const code = localStorage.getItem('code');
    const publicKey = Config.PublicKey;
    const name = ServerName.Hall;
    const url = ServerName.Hall;

    return {
        url,
        name,
        publicKey,
        code,
    };
}

export function connectSocket(config: SocketConfig) {
    return new Promise((resolve, reject) => {
        const socket = createSocket(config);
        const token = localStorage.getItem('token');
        if (token) {
            socket.setParams({ jwt: token });
            return resolve(socket);
        }

        /** 获取token */
        socket.event.once(SocketEvent.GetToken, async (jwt: string) => {
            /** 游客的token */
            if (!jwt) {
                jwt = await getGuestToken(socket);
            }
            socket.setParams({ jwt });
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

export function onTokenExpire(socket: WebSocketTrait) {
    socket.event.on(SocketEvent.ErrorCode, (code: string) => {
        localStorage.removeItem('token');
        if (code === ServerErrCode.TokenExpire) {
            console.log();
        }
    });
}
