import { SocketEvent, WebSocketTrait } from 'ctrl/net/webSocketWrap';
import {
    bindSocketEvent,
    getSocket,
    offSocketEvent,
} from 'ctrl/net/webSocketWrapUtil';
import { Config } from 'data/config';
import { ServerErrCode, ServerEvent, ServerName } from 'data/serverEvent';
import { modelState } from 'model/modelState';
import { commonSocket, errorHandler, offCommon } from './commonSocket';
import { HallCtrl } from './hallCtrl';
import { alertNetErrRefresh } from './hallCtrlUtil';
import { initHallSocket } from './login';

/**
 *
 * @return 是否进入游戏
 */
let hall_socket: WebSocketTrait;
export async function onHallSocket(hall: HallCtrl) {
    await initHallSocket();

    /** 连接socket */
    (await new Promise((resolve, reject) => {
        hall_socket = getSocket(ServerName.Hall);
        bindHallSocket(hall_socket, hall);

        hall_socket.event.once(
            ServerEvent.UserAccount,
            () => {
                hall.onUserAccount();
                resolve(undefined);
            },
            hall,
        );
        sendToHallSocket(ServerEvent.UserAccount, { domain: Config.Host });
    })) as Promise<undefined>;

    const data = await checkReplay(hall);
    if (data.isReplay) {
        // debugger;
        hall.enterGame(data);
        return true;
    }
    return false;
}
export function sendToHallSocket(
    ...params: Parameters<WebSocketTrait['send']>
) {
    hall_socket.send(...params);
}
export function offHallSocket(hall: HallCtrl) {
    offSocketEvent(hall_socket, hall);
    offCommon(hall_socket, hall);
}
function bindHallSocket(socket: WebSocketTrait, hall: HallCtrl) {
    commonSocket(socket, hall);

    bindSocketEvent(socket, hall, {
        /** 重连 */
        [SocketEvent.Reconnected]: () => {
            sendToHallSocket(ServerEvent.UserAccount);
        },
    });
}

export async function checkReplay(hall: HallCtrl) {
    return new Promise<CheckReplayRep>((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.CheckReplay,
            (data: CheckReplayRep) => {
                resolve(data);
            },
            hall,
        );
        socket.send(ServerEvent.CheckReplay);
    });
}

export function roomIn(
    data: { isTrial: 0 | 1; roomId: number },
    hall: HallCtrl,
) {
    return new Promise<Partial<RoomInRep>>((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.RoomIn,
            async (_data: RoomInRep, code, msg) => {
                if (code === ServerErrCode.AlreadyInRoom) {
                    const data = await checkReplay(hall);
                    if (data.isReplay) {
                        resolve({ ..._data, ...data });
                    }
                    return;
                } else if (code !== 200) {
                    return errorHandler(code, _data);
                }
                resolve(_data);
            },
            hall,
        );
        const currency = modelState.app.user_info.cur_balance;
        socket.send(ServerEvent.RoomIn, {
            ...data,
            currency,
            domain: '',
        } as RoomInReq);
    });
}
