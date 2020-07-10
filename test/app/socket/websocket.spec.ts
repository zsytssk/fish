import { SocketEvent, WebSocketWrapCtrl } from 'ctrl/net/webSocketWrap';
import { ServerEvent } from 'data/serverEvent';
import { WebSocketCtrl } from 'honor/net/websocket';
import { JSEncrypt } from 'jsencrypt';
import { Test } from 'testBuilder';
import { Config } from 'data/config';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';

export const web_socket_test = new Test('web_socket', runner => {
    runner.describe('create_web_socket', () => {
        const public_key =
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMUws+7NKknmImMYUsSr4DOKYVrs1s7BQzGBgkkTptjGiektUmxm3BNZq34ugF6Vob9V0vU5r0S7vfyuOTC87uFeGe+rBJf7si4kE5wsJiEBlLNZjrz0T30xHGJlf+eizYVKPkpo3012rKvHN0obBlN7iBsdiGpLGP3sPAgO2tFQIDAQAB';
        const socket = new WebSocketCtrl({
            url:
                'ws://172.17.3.46:7005/gws?auth=' +
                getAuth(public_key) +
                '&code=dd57e4b9cf1746f69618403705a5e2a3',
            handlers: {},
        });
    });

    runner.describe('create_socket', () => {
        const url = Config.SocketUrl;
        const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMUws+7NKknmImMYUsSr4DOKYVrs1s7BQzGBgkkTptjGiektUmxm3BNZq34ugF6Vob9V0vU5r0S7vfyuOTC87uFeGe+rBJf7si4kE5wsJiEBlLNZjrz0T30xHGJlf+eizYVKPkpo3012rKvHN0obBlN7iBsdiGpLGP3sPAgO2tFQIDAQAB`;
        const code = `3142a89b24424257aaf4bf66f85ff419`;
        const host = Config.Host;

        const socket = new WebSocketWrapCtrl({
            url,
            name: 'test',
            code,
            host,
            publicKey,
        });

        /** 获取token */
        socket.event.on(SocketEvent.GetToken, async (jwt: string) => {
            /** 游客的token */
            if (!jwt) {
                jwt = await getGuestToken(socket);
            }
            socket.setParams({ jwt });
            socket.send(ServerEvent.UserAccount);
        });
    });

    runner.describe('receive', (name: string, data: any) => {
        const socket = getSocket(name);
        const { cmd, code, res } = data;
        socket.event.emit(cmd, res, code);
    });
    runner.describe('send', (name: string, cmd: string, data: any) => {
        const socket = getSocket(name);
        socket.send(cmd, data);
    });
});

const date_str = new Date().toString();
const comm_key =
    Date.parse(date_str).toString() +
    Date.parse(date_str).toString() +
    Date.parse(date_str)
        .toString()
        .substring(0, 6);

function getAuth(public_key: string) {
    const jsencrypt = new JSEncrypt();
    jsencrypt.setPublicKey(public_key);
    const encryptedString = jsencrypt.encrypt(comm_key);
    return encryptedString;
}

export function getGuestToken(socket: WebSocketWrapCtrl) {
    return new Promise((resolve, reject) => {
        socket.event.once(ServerEvent.GetGuestToken, (token: string) => {
            resolve(token);
        });
        socket.send(ServerEvent.GetGuestToken);
    }) as Promise<string>;
}
