import { SocketEvent, WebSocketTrait } from '@app/ctrl/net/webSocketWrap';
import {
    bindSocketEvent,
    disconnectSocket,
    getSocket,
    offSocketEvent,
} from '@app/ctrl/net/webSocketWrapUtil';
import { Config } from '@app/data/config';
import { ServerErrCode, ServerEvent, ServerName } from '@app/data/serverEvent';
import { modelState } from '@app/model/modelState';

import { commonSocket, errorHandler, offCommon } from './commonSocket';
import { HallCtrl } from './hallCtrl';
import { connectSocket } from './login';

/**
 *
 * @return 是否进入游戏
 */
let hall_socket: WebSocketTrait;
export async function connectHallSocket(): Promise<[boolean, CheckReplayRep?]> {
    let socket = getSocket(ServerName.Hall);
    if (!socket) {
        const { SocketUrl: url, PublicKey: publicKey, Host: host } = Config;
        socket = await connectSocket({
            url,
            publicKey,
            host,
            code: Config.code,
            name: ServerName.Hall,
        });
        hall_socket = socket;

        if (!socket) {
            throw Error(`ConnectFailed:${ServerName.Hall}}`);
        }
    }

    /** 确保在复盘时已经有用户数据，不然进入游戏之后无法判断当前用户从而导致一堆问题 */
    await new Promise((resolve) => {
        hall_socket.event.once(ServerEvent.UserAccount, (data) => {
            modelState.app.initUserInfo(data);
            resolve(undefined);
        });
        sendToHallSocket(ServerEvent.UserAccount, { domain: Config.Host });
    });

    const data = await checkReplay();
    if (data.isReplay) {
        // debugger;
        return [true, data];
    }
    return [false];
}

export function sendToHallSocket(
    ...params: Parameters<WebSocketTrait['send']>
) {
    hall_socket.send(...params);
}
export function offHallSocket(hall: HallCtrl) {
    if (!hall_socket) {
        return;
    }
    offSocketEvent(hall_socket, hall);
    offCommon(hall_socket, hall);
    disconnectSocket(ServerName.Hall);
    hall_socket = undefined;
}
export async function bindHallSocket(hall: HallCtrl) {
    if (!hall_socket) {
        await connectHallSocket();
    }
    commonSocket(hall_socket, hall);

    bindSocketEvent(hall_socket, hall, {
        /** 重连 */
        [SocketEvent.Reconnected]: () => {
            sendToHallSocket(ServerEvent.UserAccount);
        },
        [ServerEvent.UserAccount]: (data, _code) => {
            modelState.app.initUserInfo(data);
        },
    });
}

export async function checkReplay(bindObj?: any) {
    return new Promise<CheckReplayRep>((resolve, _reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.CheckReplay,
            (data: CheckReplayRep) => {
                resolve(data);
            },
            bindObj,
        );
        socket.send(ServerEvent.CheckReplay);
    });
}

export function roomIn(
    data: { isTrial: 0 | 1; roomId: number },
    hall: HallCtrl,
) {
    return new Promise<Partial<RoomInRep>>((resolve, _reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.RoomIn,
            async (_data: RoomInRep, code, _msg) => {
                if (code === ServerErrCode.AlreadyInRoom) {
                    const data = await checkReplay(hall);
                    if (data.isReplay) {
                        resolve({ ..._data, ...data });
                    }
                    return;
                } else if (code !== 200) {
                    return errorHandler(code, _data, socket);
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
