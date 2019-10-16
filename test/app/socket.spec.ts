import { SocketCtrl, SocketEvent } from 'honor/net/Socket';
import { Test } from 'testBuilder';
import { vectorToAngle } from 'utils/mathUtils';

export const socket_test = new Test('socket', runner => {
    runner.describe('connect', () => {
        const socket = new SocketCtrl({
            url: 'http://localhost:3000',
            token: 'this is a test',
        });

        socket.event.on(SocketEvent.Connect, () => {
            console.log('connect');
            socket.send('cmd', { msg: 'this is a test' });
        });
    });
});
