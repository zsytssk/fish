import { WebSocketTrait, Config } from 'ctrl/net/webSocketWrap';
import { EventCom } from 'comMan/eventCom';

/** 本地测试数据的socket... */
export class MockWebSocket implements WebSocketTrait {
    public event = new EventCom();
    public sendEvent = new EventCom();
    constructor(config: Config) {
        console.log(config);
    }
    public setParams(params: {}) {
        console.log(params);
    }
    public send(cmd: string, data: {}) {
        this.sendEvent.emit(cmd, data);
        console.log(cmd, data);
    }
    public disconnect() {
        console.log('disconnect');
    }
}
