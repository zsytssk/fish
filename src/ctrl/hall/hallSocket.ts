import { HallCtrl } from './hallCtrl';
import { WebSocketTrait } from 'ctrl/net/webSocketWrap';
import { bindSocketEvent } from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent } from 'data/serverEvent';
import { Config } from 'data/config';

export function onHallSocket(socket: WebSocketTrait, hall: HallCtrl) {
    bindSocketEvent(socket, hall, {
        [ServerEvent.UserAccount]: data => {
            hall.onUserAccount(data);
        },
    });

    socket.send(ServerEvent.UserAccount, { domain: Config.Host });
}
