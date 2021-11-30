import { Test } from 'testBuilder';

import { SocketCtrl, SocketEvent } from 'honor/net/Socket';
import { injectProto } from 'honor/utils/tool';

import { AppCtrl } from '@app/ctrl/appCtrl';

export const socket_test = new Test('socket', (runner) => {
    runner.describe('init_app_socket', () => {
        injectProto(AppCtrl, 'enterGame', (app: AppCtrl) => {
            const socket = new SocketCtrl({
                url: 'http://localhost:3000',
                token: 'this is a test',
            });
        });
    });
    runner.describe('init_app_socket', () => {
        injectProto(AppCtrl, 'enterGame', (app: AppCtrl) => {
            const socket = new SocketCtrl({
                url: 'http://localhost:3000',
                token: 'this is a test',
            });
        });
    });

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
