import { HallCtrl } from './hallCtrl';
import { WebSocketTrait } from 'ctrl/net/webSocketWrap';
import { bindSocketEvent, getSocket } from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { Config } from 'data/config';
import { ctrlState } from 'ctrl/ctrlState';
import { login } from './login';

export async function onHallSocket(hall: HallCtrl) {
    await login();
    const socket = getSocket(ServerName.Hall);
    bindSocketEvent(socket, hall, {
        [ServerEvent.UserAccount]: data => {
            hall.onUserAccount(data);
        },
    });

    socket.send(ServerEvent.UserAccount, { domain: Config.Host });
}
export function roomIn() {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(ServerEvent.RoomIn, () => {
            ctrlState.app.enterGame();
            resolve();
        });
        socket.send(ServerEvent.RoomIn, {
            roomId: 1,
            currency: 'ETH',
            isTrial: 0,
            domain: 'https://testing-bitfish.cointest.link',
        });
    });
}
export function roomOut() {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(ServerEvent.RoomOut, () => {
            ctrlState.app.enterGame();
            resolve();
        });
        socket.send(ServerEvent.RoomIn, {
            roomId: 1,
            currency: 'ETH',
            isTrial: 0,
            domain: 'https://testing-bitfish.cointest.link',
        });
    });
}
