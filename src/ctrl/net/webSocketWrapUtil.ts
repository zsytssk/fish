import { JSEncrypt } from 'jsencrypt';
import CryptoJS from 'crypto-js';
import { WebSocketWrapCtrl, Config } from './webSocketWrap';

/** socket 的工具函数 */
let comm_key: string;
const socket_map: Map<string, WebSocketWrapCtrl> = new Map();
export function connectSocket(config: Config) {
    const { name } = config;
    const socket = new WebSocketWrapCtrl(config);
    socket_map.set(name, socket);
    return socket;
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
