import { Config } from '@app/data/config';
import { isProd } from '@app/data/env';
import { ArenaEvent, ServerErrCode, ServerName } from '@app/data/serverEvent';
import { modelState } from '@app/model/modelState';
import { getItem, setItem } from '@app/utils/localStorage';
import { log } from '@app/utils/log';
import { getParams, tplStr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';

import {
    Config as SocketConfig,
    SocketEvent,
    WebSocketTrait,
} from '../net/webSocketWrap';
import {
    bindSocketEvent,
    createSocket,
    getSocket,
    offSocketEvent,
} from '../net/webSocketWrapUtil';
import { HallCtrl } from './hallCtrl';

let arena_hall_socket: WebSocketTrait;
export async function connectArenaHallSocket(hall: HallCtrl) {
    let socket = getSocket(ServerName.ArenaHall);
    if (socket) {
        return;
    }

    const { arenaSocketUrl: url, PublicKey: publicKey, Host: host } = Config;
    socket = await connectArenaSocket({
        url,
        publicKey,
        host,
        code: Config.code,
        name: ServerName.ArenaHall,
    });
    arena_hall_socket = socket;
    bindArenaHallSocket(socket, hall);
}

export function sendToArenaHallSocket(
    ...params: Parameters<WebSocketTrait['send']>
) {
    arena_hall_socket.send(...params);
}

/** 绑定ArenaSocket */
function bindArenaHallSocket(socket: WebSocketTrait, hall: HallCtrl) {
    bindSocketEvent(socket, hall, {
        [ArenaEvent.ArenaStatus]: (data, _code) => {
            modelState.app.arena_info.updateInfo(data);
        },
        [SocketEvent.End]: () => {
            AlertPop.alert(tplStr(ServerErrCode.NetError)).then(() => {
                location.reload();
            });
        },
    });
}
/** 解除绑定ArenaSocket */
export function offArenaHallSocket(hall: HallCtrl) {
    offSocketEvent(arena_hall_socket, hall);
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
        AlertPop.alert(tplStr(ServerErrCode.NetError)).then(() => {
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
