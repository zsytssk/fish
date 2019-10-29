import { ComponentManager } from 'comMan/component';
import { WebSocketCtrl } from 'honor/net/websocket';
import { EventCom } from 'comMan/eventCom';
import { getAuth, encrypt, decrypt } from './webSocketWrapUtil';

export type Config = {
    url: string;
    name: string;
    publicKey: string;
    code: string;
};

/** 服务器数据类型 */
enum ServerMsgType {
    OnData = '0',
    PingTimeOut = '1',
    Ping = '2',
    Pong = '3',
    Error = '4',
    MsgAck = '5',
}

const ping_pong_map = {
    ping: '2',
    pong: '3',
};

/** 默认socket的事件 */
export const SocketEvent = {
    Init: 'init',
    GetToken: 'get_token',
    Connect: 'connect',
    Reconnecting: 'reconnecting',
    Reconnected: 'reconnected',
    Close: 'close',
    Error: 'error',
    End: 'end',
};

/** websocket 的 */
export class WebSocketWrapCtrl extends ComponentManager {
    private ws: WebSocketCtrl;
    private params: {} = {};
    public event: EventCom;
    private config: Config;
    constructor(config: Config) {
        super();
        this.config = config;
        this.init();
    }
    private init() {
        const event = new EventCom();
        this.addCom(event);
        this.event = event;

        const { url, publicKey, code } = this.config;
        const new_url = `ws://${url}/gws?auth=${getAuth(
            publicKey,
        )}'&code=${code}`;
        const ws = new WebSocketCtrl({
            url: new_url,
            handlers: {
                onInit: this.onInit,
                onData: this.onData,
                onClose: this.onClose,
                onEnd: this.onEnd,
                onReconnect: this.onReconnect,
                onReconnected: this.onReconnected,
            },
            ping_pong_map,
        });
        this.ws = ws;
    }
    /** 设置本地默认参数 */
    public setParams(params: {}) {
        this.params = {
            ...this.params,
            ...params,
        };
    }
    /** 发送数据给服务端 */
    public send(cmd: string, data = {}) {
        const { ws } = this;
        const { params } = this;
        const send_data = {
            cmd,
            params: {
                ...params,
                ...data,
            },
        };
        const send_str = '0' + encrypt(JSON.stringify(send_data));
        ws.send(send_str);
    }
    public disconnect() {
        this.ws.disconnect();
        this.ws = undefined;
    }
    private onInit = () => {
        this.event.emit(SocketEvent.Init);
    }; //tslint:disable-line
    private onData = (msg: string) => {
        const { ws } = this;
        const data_str = msg.substring(1);
        const type = msg.charAt(0);
        let data: { cmd: string; code: number; res: {} };
        switch (type) {
            case ServerMsgType.OnData:
                data = decrypt(data_str);
                const { cmd, res, code } = data;
                this.event.emit(cmd, res, code);
                break;
            case ServerMsgType.PingTimeOut:
                const { jwt } = JSON.parse(data_str);
                this.event.emit(SocketEvent.GetToken, jwt);
                break;
            case ServerMsgType.Error:
                break;
            case ServerMsgType.MsgAck:
                break;
        }
    }; //tslint:disable-line
    private onClose = () => {
        this.event.emit(SocketEvent.Close);
    }; //tslint:disable-line
    private onEnd = () => {
        this.event.emit(SocketEvent.End);
    }; //tslint:disable-line
    private onReconnect = () => {
        this.event.emit(SocketEvent.Reconnected);
    }; //tslint:disable-line
    private onReconnected = () => {
        this.event.emit(SocketEvent.Reconnected);
    }; //tslint:disable-line
}
