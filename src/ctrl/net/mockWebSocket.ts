import { EventCom } from 'comMan/eventCom';
import { Status } from 'honor/net/websocket';

import {
    WebSocketTrait,
    Config,
    SocketEvent,
} from '@app/ctrl/net/webSocketWrap';
import { ARENA_OK_CODE, OK_CODE } from '@app/data/serverEvent';
import { log } from '@app/utils/log';

/** 本地测试数据的socket... */
export class MockWebSocket implements WebSocketTrait {
    public event = new EventCom();
    public sendEvent = new EventCom();
    public config: Config;
    public status = 'OPEN' as Status;
    constructor(config: Config) {
        this.config = config;
    }
    public setParams(params: {}) {
        log(params);
    }
    public connect() {
        return Promise.resolve(true);
    }
    public reconnect() {}
    public send(cmd: string, data: {}) {
        this.sendEvent.emit(cmd, data);
        log(`mockWebSocket:>`, cmd, data);
    }
    public disconnect() {
        this.event.destroy();
        this.sendEvent.destroy();
        log('disconnect');
    }
}
