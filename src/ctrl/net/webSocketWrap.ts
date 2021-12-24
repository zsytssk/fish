/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { WebSocketCtrl, Status } from 'honor/net/websocket';

import { log, error } from '@app/utils/log';

import { decrypt, encrypt, genUrl } from './webSocketWrapUtil';

export type Config = {
    url: string;
    name: string;
    publicKey: string;
    host: string;
    code?: string;
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
    Connect: 'connect',
    Reconnecting: 'reconnecting',
    Reconnected: 'reconnected',
    Close: 'close',
    Error: 'error',
    End: 'end',
    CheckError: 'CheckError',
};

export interface WebSocketTrait {
    event: EventCom;
    setParams(params: {}): void;
    send(cmd: string, data?: {}): void;
    disconnect(): void;
    reconnect(): void;
    config: Config;
    status: Status;
}
/** websocket 的 */
export class WebSocketWrapCtrl
    extends ComponentManager
    implements WebSocketTrait
{
    private ws: WebSocketCtrl;
    private params: {} = {};
    public event: EventCom;
    public config: Config;

    constructor(config: Config) {
        super();
        this.config = config;
        this.init();
    }
    private init() {
        const event = new EventCom();
        this.addCom(event);
        this.event = event;
        this.connect();
    }
    private connect() {
        const new_url = genUrl(this.config);
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
    public get status() {
        if (this.ws) {
            return this.ws.status;
        }
        return 'CLOSED';
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
        const {
            ws,
            params,
            config: { name },
        } = this;
        log(`${name}:>发送:>`, cmd, data);
        const send_data = {
            cmd,
            params: {
                ...params,
                ...data,
            },
        };
        const send_str = '0' + encrypt(name, JSON.stringify(send_data));
        ws.send(send_str);
    }
    public disconnect() {
        this.event.destroy();
        this.ws.disconnect();
        this.ws = undefined;
    }
    public reconnect() {
        const { ws } = this;
        if (!ws) {
            return error('WebSocketWrapCtrl:> is disconnected!');
        }
        if (ws.status !== 'CLOSED') {
            return;
        }
        this.ws.reconnect();
    }
    private onInit = () => {
        this.event.emit(SocketEvent.Init);
    }; //tslint:disable-line
    private onData = (raw_msg: string) => {
        const { name } = this.config;
        const data_str = raw_msg.substring(1);
        const type = raw_msg.charAt(0);
        let data: {
            cmd: string;
            code: number;
            msg: string;
            res: any;
            data: any;
        };
        switch (type) {
            case ServerMsgType.OnData:
                {
                    data = decrypt(name, data_str);
                    if (!data) {
                        return;
                    }
                    const { cmd, res, data: _data, code, msg } = data;
                    log(`${name}:>接收:>${cmd}`, data);
                    this.event.emit(cmd, res || _data, code, msg);
                }
                break;
                // case ServerMsgType.PingTimeOut:
                //     const { jwt } = JSON.parse(data_str);
                //     this.event.emit(SocketEvent.GetToken, jwt);
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
    private onReconnect = (no: number) => {
        this.event.emit(SocketEvent.Reconnecting, no);
    }; //tslint:disable-line
    private onReconnected = () => {
        this.event.emit(SocketEvent.Reconnected);
    }; //tslint:disable-line
}
