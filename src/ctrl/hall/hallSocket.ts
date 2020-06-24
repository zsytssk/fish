import { WebSocketTrait, SocketEvent } from 'ctrl/net/webSocketWrap';
import {
    getSocket,
    bindSocketEvent,
    offSocketEvent,
} from 'ctrl/net/webSocketWrapUtil';
import { Config } from 'data/config';
import { InternationalTip } from 'data/internationalConfig';
import { ServerErrCode, ServerEvent, ServerName } from 'data/serverEvent';
import { modelState } from 'model/modelState';
import AlertPop from 'view/pop/alert';
import { commonSocket, offCommon, errorHandler } from './commonSocket';
import { HallCtrl } from './hallCtrl';
import { getLang } from './hallCtrlUtil';
import { initHallSocket } from './login';
import TopTipPop from 'view/pop/topTip';
import { sleep } from 'utils/animate';

/**
 *
 * @return 是否进入游戏
 */
let hall_socket: WebSocketTrait;
export async function onHallSocket(hall: HallCtrl) {
    await initHallSocket();

    /** 连接socket */
    await new Promise((resolve, reject) => {
        hall_socket = getSocket(ServerName.Hall);
        bindHallSocket(hall_socket, hall);

        hall_socket.event.once(
            ServerEvent.UserAccount,
            () => {
                hall.onUserAccount();
                resolve();
            },
            hall,
        );
        sendToHallSocket(ServerEvent.UserAccount, { domain: Config.Host });
    });

    const [isReplay, socketUrl] = await checkReplay(hall);
    if (isReplay) {
        debugger;
        hall.enterGame(socketUrl);
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
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.CheckReplay,
            (data: CheckReplayRep) => {
                const { isReplay, socketUrl } = data;
                if (isReplay) {
                    resolve([isReplay, socketUrl]);
                    return;
                }
                resolve([isReplay, socketUrl]);
            },
            hall,
        );
        socket.send(ServerEvent.CheckReplay);
    }) as Promise<[boolean, string?]>;
}

export function roomIn(
    data: { isTrial: 0 | 1; roomId: number },
    hall: HallCtrl,
) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.RoomIn,
            async (_data: RoomInRep, code, msg) => {
                if (code === ServerErrCode.AlreadyInRoom) {
                    const [isReplay, socketUrl] = await checkReplay(hall);
                    if (isReplay) {
                        resolve(socketUrl);
                    }
                    return;
                } else if (code !== 200) {
                    return errorHandler(code);
                }
                resolve(_data.socketUrl);
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
