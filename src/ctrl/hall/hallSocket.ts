import { coingameGetDomain } from 'coingame/coingameUtil';
import { ctrlState } from 'ctrl/ctrlState';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { Config } from 'data/config';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { modelState } from 'model/modelState';
import AlertPop from 'view/pop/alert';
import { HallCtrl } from './hallCtrl';
import { login } from './login';

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
                    return;
                }
                resolve(false);
            },
            hall,
        );
        socket.send(ServerEvent.CheckReplay);
    });
}

export function roomIn(data: { isTrial: 0 | 1; roomId: number }) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(ServerEvent.RoomIn, (_data: RoomInRep) => {
            ctrlState.app.enterGame(_data.socketUrl);
            resolve();
        });
        const currency = modelState.app.user_info.cur_balance;
        socket.send(ServerEvent.RoomIn, {
            ...data,
            currency,
            domain: coingameGetDomain(),
        } as RoomInReq);
    });
}
