import { JSEncrypt } from 'jsencrypt';
import CryptoJS from 'crypto-js';
import {
    WebSocketWrapCtrl,
    Config,
    WebSocketTrait,
    SocketEvent,
} from './webSocketWrap';

/** socket 的工具函数 */
let comm_key: string;
let socket_ctor: Ctor<WebSocketTrait>;
const socket_map: Map<string, WebSocketTrait> = new Map();

export function createSocket(config: Config) {
    const { name } = config;
    const ctor = socket_ctor || WebSocketWrapCtrl;
    const socket = new ctor(config);
    socket_map.set(name, socket);
    return socket;
}

export function mockSocketCtor(ctor: Ctor<WebSocketTrait>) {
    socket_ctor = ctor;
}
export function getSocket(name: string) {
    return socket_map.get(name);
}
export function disconnectSocket(name: string) {
    const socket = socket_map.get(name);
    if (socket) {
        socket.disconnect();
        socket_map.delete(name);
    }
}

export function createComKey() {
    const date_str = new Date().toString();
    comm_key =
        Date.parse(date_str).toString() +
        Date.parse(date_str).toString() +
        Date.parse(date_str)
            .toString()
            .substring(0, 6);
}

export function getAuth(public_key: string) {
    createComKey();
    const jsencrypt = new JSEncrypt();
    jsencrypt.setPublicKey(public_key);
    const encryptedString = jsencrypt.encrypt(comm_key);
    return encryptedString;
}

export function decrypt(data: string) {
    const desData = CryptoJS.AES.decrypt(
        data,
        CryptoJS.enc.Utf8.parse(comm_key),
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        },
    );
    const rep_str = desData.toString(CryptoJS.enc.Utf8);
    const rep = JSON.parse(rep_str);
    return rep;
}

export function encrypt(msg: string) {
    const encryptData = CryptoJS.AES.encrypt(
        msg,
        CryptoJS.enc.Utf8.parse(comm_key),
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        },
    );
    return encryptData.toString();
}
