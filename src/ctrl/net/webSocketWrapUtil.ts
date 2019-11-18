import { JSEncrypt } from 'jsencrypt';
import CryptoJS from 'crypto-js';
import {
    WebSocketWrapCtrl,
    Config,
    WebSocketTrait,
    SocketEvent,
} from './webSocketWrap';

/** socket 的工具函数 */
const common_key_map: Map<string, string> = new Map();
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

export function createComKey(name: string) {
    const date_str = new Date().toString();
    const comm_key =
        Date.parse(date_str).toString() +
        Date.parse(date_str).toString() +
        Date.parse(date_str)
            .toString()
            .substring(0, 6);
    common_key_map.set(name, comm_key);
    return comm_key;
}

export function genUrl(config: Config) {
    const { url, publicKey, code, host, name } = config;
    let new_url = `wss://${url}/gws?auth=${getAuth(name, publicKey)}`;
    if (host) {
        new_url += `&host=${host}`;
    }
    if (code) {
        new_url += `&code=${code}`;
    }
    return new_url;
}

export function getAuth(name: string, public_key: string) {
    const comm_key = createComKey(name);
    const jsencrypt = new JSEncrypt();
    jsencrypt.setPublicKey(public_key);
    const encryptedString = jsencrypt.encrypt(comm_key);
    return encryptedString;
}

export function decrypt(name: string, data: string) {
    try {
        const comm_key = common_key_map.get(name);
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
    } catch {
        console.error('cant decrypt data');
        return '';
    }
}

export function encrypt(name: string, msg: string) {
    const comm_key = common_key_map.get(name);
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

export function bindSocketEvent(
    socket: WebSocketTrait,
    bind_obj: any,
    bind_info: { [key: string]: Func<void> },
) {
    const { event } = socket;
    for (const key in bind_info) {
        if (!bind_info.hasOwnProperty(key)) {
            continue;
        }
        event.on(key, bind_info[key], bind_obj);
    }
}
export function offSocketEvent(socket: WebSocketTrait, bind_obj: any) {
    const { event } = socket;
    event.offAllCaller(bind_obj);
}
