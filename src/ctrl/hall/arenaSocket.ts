import {
    ArenaGameStatus,
    ArenaStatus,
    ArenaStatusData,
} from '@app/api/arenaApi';
import { Config } from '@app/data/config';
import { isProd } from '@app/data/env';
import {
    ArenaEvent,
    ARENA_OK_CODE,
    ServerErrCode,
    ServerName,
} from '@app/data/serverEvent';
import { modelState } from '@app/model/modelState';
import { getItem, setItem } from '@app/utils/localStorage';
import { log } from '@app/utils/log';
import { getParams, tplIntr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';
import { getCompetitionInfo } from '@app/view/pop/popSocket';
import TipPop from '@app/view/pop/tip';

import { GameCtrl } from '../game/gameArena/gameCtrl';
import { Config as SocketConfig, WebSocketTrait } from '../net/webSocketWrap';
import {
    bindSocketEvent,
    createSocket,
    getSocket,
    offSocketEvent,
} from '../net/webSocketWrapUtil';
import { commonSocket, errorHandler } from './commonSocket';
import { HallCtrl } from './hallCtrl';

let arena_hall_socket: WebSocketTrait;
export async function connectArenaHallSocket(checkReplay = false) {
    let socket = getSocket(ServerName.ArenaHall);
    if (!socket) {
        const {
            arenaSocketUrl: url,
            PublicKey: publicKey,
            Host: host,
        } = Config;
        socket = await connectArenaSocket({
            url,
            publicKey,
            host,
            code: Config.code,
            name: ServerName.ArenaHall,
        });
        arena_hall_socket = socket;

        if (!socket) {
            throw Error(`ConnectFailed:${ServerName.ArenaHall}}`);
        }
    }

    if (checkReplay) {
        const data = await new Promise<ArenaStatusData | void>((resolve) => {
            arena_hall_socket.event.once(
                ArenaEvent.ArenaStatus,
                (data: ArenaStatusData, code: number) => {
                    if (code !== ARENA_OK_CODE) {
                        return resolve();
                    }
                    modelState.app.arena_info.updateInfo(data);
                    resolve(data);
                },
            );
            sendToArenaHallSocket(ArenaEvent.ArenaStatus, {
                currency: modelState.app.user_info.cur_balance,
            });
        });

        if (
            !data ||
            data.roomStatus !== ArenaStatus.Open ||
            (data.userStatus !== ArenaGameStatus.GAME_STATUS_SIGNUP &&
                data.userStatus !== ArenaGameStatus.GAME_STATUS_SIGNUP_OVER &&
                data.userStatus !== ArenaGameStatus.GAME_STATUS_PLAYING)
        ) {
            return false;
        }

        return true;
    }
}

export function sendToArenaHallSocket(
    ...params: Parameters<WebSocketTrait['send']>
) {
    arena_hall_socket.send(...params);
}

/** 绑定ArenaSocket */
export async function bindArenaHallSocket(hall: HallCtrl) {
    if (!arena_hall_socket) {
        await connectArenaHallSocket();
    }

    bindSocketEvent(arena_hall_socket, hall, {
        [ArenaEvent.ArenaStatus]: (data, _code) => {
            modelState.app.arena_info.updateInfo(data);
        },
    });

    commonSocket(arena_hall_socket, hall);
}
/** 解除绑定ArenaSocket */
export function offArenaHallSocket(hall: any) {
    if (arena_hall_socket) {
        offSocketEvent(arena_hall_socket, hall);
    }
}

export async function waitConnectGameArena() {
    let socket = getSocket(ServerName.ArenaHall);
    if (!socket) {
        const {
            arenaSocketUrl: url,
            PublicKey: publicKey,
            Host: host,
        } = Config;
        socket = await connectArenaSocket({
            url,
            publicKey,
            host,
            code: Config.code,
            name: ServerName.ArenaHall,
        });
    }
    arena_hall_socket = socket;
    return socket;
}

export async function connectArenaSocket(
    config: SocketConfig,
): Promise<WebSocketTrait> {
    const socket = await createSocket(
        config,
        isProd() ? 3 : 1,
        isProd() ? 3 : 0,
    );
    if (!socket && isProd()) {
        AlertPop.alert(tplIntr(ServerErrCode.NetError)).then(() => {
            location.reload();
        });
        return;
    }

    const token = Config.token;
    if (token) {
        socket.setParams({ jwt: token, userId: getParams('userId') });
        return socket;
    }

    /** 获取 本地保存的 token */
    let guess_token = getItem('local_arena_token');
    if (!guess_token) {
        guess_token = await getArenaGuestToken(socket);
        setItem('local_arena_token', guess_token, 7);
    }
    /** 游客的token */
    socket.setParams({ jwt: guess_token, userId: getParams('userId') });
    log('本地Guess arenaToken:', guess_token);
    return socket;
}

export function getArenaGuestToken(socket: WebSocketTrait) {
    return new Promise((resolve, _reject) => {
        socket.event.once(ArenaEvent.Guess, (res: { jwt: string }) => {
            resolve(res.jwt);
        });
        socket.send(ArenaEvent.Guess);
    }) as Promise<string>;
}

export function arenaErrHandler(
    ctrl: GameCtrl | any,
    code: number,
    data?: any,
    socket?: WebSocketTrait,
) {
    if (code === ServerErrCode.Maintenance) {
        if (ctrl instanceof GameCtrl) {
            AlertPop.alert('游戏维护中，请退出游戏！', {
                hide_cancel: true,
            }).then(() => {
                ctrl.leave();
            });
        } else {
            TipPop.tip('游戏维护中');
        }
        return true;
    }
    errorHandler(code, data, socket);
}
