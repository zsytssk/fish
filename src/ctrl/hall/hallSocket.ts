import { ctrlState } from 'ctrl/ctrlState';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { Config } from 'data/config';
import { ServerEvent, ServerName, ServerErrCode } from 'data/serverEvent';
import { modelState } from 'model/modelState';
import AlertPop from 'view/pop/alert';
import { HallCtrl } from './hallCtrl';
import { login } from './login';

/**
 *
 * @return 是否进入游戏
 */
export async function onHallSocket(hall: HallCtrl) {
    await login();

    await new Promise((resolve, reject) => {
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

    const [isReplay, socketUrl] = await checkReplay();
    if (isReplay) {
        AlertPop.alert('你当前在游戏中是否重新进入?').then(type => {
            if (type === 'confirm') {
                ctrlState.app.enterGame(socketUrl);
                return true;
            }
        });
    }
    return false;
}

export async function checkReplay() {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(ServerEvent.CheckReplay, (data: CheckReplayRep) => {
            const { isReplay, socketUrl } = data;
            if (isReplay) {
                resolve([isReplay, socketUrl]);
                return;
            }
            resolve([isReplay, socketUrl]);
        });
        socket.send(ServerEvent.CheckReplay);
    }) as Promise<[boolean, string?]>;
}

export function roomIn(data: { isTrial: 0 | 1; roomId: number }) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.RoomIn,
            async (_data: RoomInRep, code, msg) => {
                if (code === ServerErrCode.AlreadyInRoom) {
                    const [isReplay, socketUrl] = await checkReplay();
                    if (isReplay) {
                        ctrlState.app.enterGame(socketUrl);
                    }
                    return;
                }
                ctrlState.app.enterGame(_data.socketUrl);
                resolve();
            },
        );
        const currency = modelState.app.user_info.cur_balance;
        socket.send(ServerEvent.RoomIn, {
            ...data,
            currency,
            domain: '',
        } as RoomInReq);
    });
}
