import { ctrlState } from 'ctrl/ctrlState';
import { bindSocketEvent, getSocket } from 'ctrl/net/webSocketWrapUtil';
import { Config } from 'data/config';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { HallCtrl } from './hallCtrl';
import { login } from './login';
import AlertPop from 'view/pop/alert';

export async function onHallSocket(hall: HallCtrl) {
    await login();

    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.UserAccount,
            (data: UserAccountRep) => {
                hall.onUserAccount(data);
                resolve();
            },
            hall,
        );
        socket.send(ServerEvent.UserAccount, { domain: Config.Host });
    });
}

export async function checkReplay(hall: HallCtrl) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.CheckReplay,
            (data: CheckReplayRep) => {
                const { isReplay, socketUrl } = data;
                if (isReplay) {
                    AlertPop.alert('你当前在游戏中是否重新进入?').then(type => {
                        if (type === 'confirm') {
                            ctrlState.app.enterGame(socketUrl);
                            resolve(true);
                        }
                    });
                }
                resolve(false);
            },
            hall,
        );
        socket.send(ServerEvent.CheckReplay);
    });
}

export function roomIn() {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(ServerEvent.RoomIn, (data: RoomInRep) => {
            ctrlState.app.enterGame(data.socketUrl);
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
