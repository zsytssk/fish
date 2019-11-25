import { WebSocketTrait, Config, SocketEvent } from 'ctrl/net/webSocketWrap';
import { EventCom } from 'comMan/eventCom';

/** 本地测试数据的socket... */
export class MockWebSocket implements WebSocketTrait {
    public event = new EventCom();
    public sendEvent = new EventCom();
    constructor(config: Config) {
        setTimeout(() => {
            this.event.emit(SocketEvent.Init);
        });
    }
    public setParams(params: {}) {
        console.log(params);
    }
    public send(cmd: string, data: {}) {
        this.sendEvent.emit(cmd, data);
        console.log(`mockWebSocket:>`, cmd, data);
    }
    public disconnect() {
        console.log('disconnect');
    }
}
