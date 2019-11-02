import {
    connectSocket,
    getSocket,
    mockSocketCtor,
} from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent } from 'data/serverEvent';
import { Test } from 'testBuilder';
import { test_data } from '../../../testData';
import { MockWebSocket } from './mockWebSocket';

export const mock_web_socket_test = new Test('mock_web_socket', runner => {
    runner.describe('create', () => {
        mockSocketCtor(MockWebSocket);
        connectSocket({
            url: '',
            publicKey: '',
            code: '',
            name: 'game',
        });
    });

    runner.describe('on_hit', () => {
        mock_web_socket_test.runTest('create');
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        sendEvent.on(ServerEvent.Hit, (data: HitReq) => {
            event.emit(ServerEvent.Hit, {
                userId: test_data.userId,
                eid: data.eid,
                win: 10000,
            } as HitRep);
        });
    });
});
