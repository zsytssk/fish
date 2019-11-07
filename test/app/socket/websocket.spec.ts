import { WebSocketWrapCtrl, SocketEvent } from 'ctrl/net/webSocketWrap';
import { WebSocketCtrl } from 'honor/net/websocket';
import { JSEncrypt } from 'jsencrypt';
import { Test } from 'testBuilder';

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
        const url = '172.17.3.46:7005';
        const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMUws+7NKknmImMYUsSr4DOKYVrs1s7BQzGBgkkTptjGiektUmxm3BNZq34ugF6Vob9V0vU5r0S7vfyuOTC87uFeGe+rBJf7si4kE5wsJiEBlLNZjrz0T30xHGJlf+eizYVKPkpo3012rKvHN0obBlN7iBsdiGpLGP3sPAgO2tFQIDAQAB`;
        const code = `c3392c356cc746e3b845632ac9753f05`;

        const socket = new WebSocketWrapCtrl({
            url,
            name: 'test',
            code,
            publicKey,
        });

        /** 获取token */
        socket.event.on(SocketEvent.GetToken, (jwt: string) => {
            socket.setParams({ jwt });
            socket.send('userAccount');
        });
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
