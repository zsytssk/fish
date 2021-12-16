import { SocketEvent, WebSocketTrait } from '@app/ctrl/net/webSocketWrap';
import {
    bindSocketEvent,
    getSocket,
    offSocketEvent,
} from '@app/ctrl/net/webSocketWrapUtil';
import { Config } from '@app/data/config';
import { ServerErrCode, ServerEvent, ServerName } from '@app/data/serverEvent';
import { modelState } from '@app/model/modelState';
import { error } from '@app/utils/log';

import { commonSocket, errorHandler, offCommon } from './commonSocket';
import { HallCtrl } from './hallCtrl';
import { connectSocket } from './login';

/**
 *
 * @return 是否进入游戏
 */
let hall_socket: WebSocketTrait;
export async function connectHallSocket(hall: HallCtrl) {
    try {
        let socket = getSocket(ServerName.Hall);
        if (socket) {
            return true;
        }

        const { SocketUrl: url, PublicKey: publicKey, Host: host } = Config;
        socket = await connectSocket({
            url,
            publicKey,
            host,
            code: Config.code,
            name: ServerName.Hall,
        });
        hall_socket = socket;

        /** 确保在复盘时已经有用户数据，不然进入游戏之后无法判断当前用户从而导致一堆问题 */
        await new Promise((resolve) => {
            bindHallSocket(hall_socket, hall);

            hall_socket.event.once(
                ServerEvent.UserAccount,
                () => {
                    resolve(undefined);
                },
                hall,
            );
            sendToHallSocket(ServerEvent.UserAccount, { domain: Config.Host });
        });

        const data = await checkReplay(hall);
        if (data.isReplay) {
            // debugger;
            hall.enterGame(data);
            return true;
        }
        return false;
    } catch (err) {
        error(`connectHallSocket:>error`, err);
        return false;
    }
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
}
function bindHallSocket(socket: WebSocketTrait, hall: HallCtrl) {
    commonSocket(socket, hall);

    bindSocketEvent(socket, hall, {
        /** 重连 */
        [SocketEvent.Reconnected]: () => {
            sendToHallSocket(ServerEvent.UserAccount);
        },
        [ServerEvent.UserAccount]: (data, _code) => {
            modelState.app.initUserInfo(data);
        },
    });
}

export async function checkReplay(hall: HallCtrl) {
    return new Promise<CheckReplayRep>((resolve, _reject) => {
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
