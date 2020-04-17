import { ctrlState } from 'ctrl/ctrlState';
import {
    getSocket,
    waitCreateSocket,
    bindSocketEvent,
    disconnectSocket,
} from 'ctrl/net/webSocketWrapUtil';
import { Config } from 'data/config';
import {
    ServerEvent,
    ServerName,
    ServerErrCode,
    ErrorData,
} from 'data/serverEvent';
import { modelState } from 'model/modelState';
import AlertPop from 'view/pop/alert';
import { HallCtrl } from './hallCtrl';
import { initHallSocket } from './login';
import { getLang } from './hallCtrlUtil';
import { InternationalTip } from 'data/internationalConfig';
import { WebSocketTrait, SocketEvent } from 'ctrl/net/webSocketWrap';
import { commonSocket, offCommon } from './commonSocket';

/**
 *
 * @return 是否进入游戏
 */
export async function onHallSocket(hall: HallCtrl) {
    await initHallSocket();

    await new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.UserAccount,
            () => {
                hall.onUserAccount();
                resolve();
            },
            hall,
        );
        socket.send(ServerEvent.UserAccount, { domain: Config.Host });
    });

    const [isReplay, socketUrl] = await checkReplay();
    if (isReplay) {
        const lang = getLang();
        const { reEnter } = InternationalTip[lang];
        AlertPop.alert(reEnter).then(type => {
            if (type === 'confirm') {
                hall.enterGame(socketUrl);
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
                        resolve(socketUrl);
                    }
                    return;
                }
                resolve(_data.socketUrl);
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

let hall_socket: WebSocketTrait;
export function hallSocket(socket: WebSocketTrait, hall: HallCtrl) {
    hall_socket = socket;
    bindSocketEvent(socket, hall, {
        [ServerEvent.ErrCode]: (res: ErrorData) => {
            const { code, error } = res;
            const lang = getLang();
            const { logoutTip } = InternationalTip[lang];
            if (code === 1003) {
                disconnectSocket(socket.config.name);
                AlertPop.alert(logoutTip, {
                    hide_cancel: true,
                }).then(() => {
                    location.reload();
                });
            }
        },
        [SocketEvent.End]: (res: ErrorData) => {
            const lang = getLang();
            const { logoutTip } = InternationalTip[lang];
            AlertPop.alert(logoutTip, { hide_cancel: true }).then(type => {
                location.reload();
            });
        },
    });

    commonSocket(socket, hall);
}

export function offHallSocket(hall: HallCtrl) {
    offCommon(hall_socket, hall);
    hall_socket.event.offAllCaller(hall);
}
