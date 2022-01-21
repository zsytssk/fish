import {
    ArenaGameStatus,
    ArenaStatus,
    ArenaStatusData,
} from '@app/api/arenaApi';
import { Config } from '@app/data/config';
import { isProd } from '@app/data/env';
import {
    ArenaErrCode,
    ArenaEvent,
    ARENA_OK_CODE,
    ErrorData,
    ServerErrCode,
    ServerEvent,
    ServerName,
} from '@app/data/serverEvent';
import { modelState } from '@app/model/modelState';
import { asyncOnly } from '@app/utils/asyncQue';
import { getItem, setItem } from '@app/utils/localStorage';
import { error, log } from '@app/utils/log';
import { getParams, tplIntr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';
import TipPop from '@app/view/pop/tip';

import { AppCtrl } from '../appCtrl';
import { ctrlState, getGameCurrency } from '../ctrlState';
import { GameCtrl } from '../game/gameArena/gameCtrl';
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
import { tipComeBack } from './commonSocket';
import { HallCtrl } from './hallCtrl';
import { recharge } from './hallCtrlUtil';
import { login } from './login';

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
            error(`ConnectFailed:${ServerName.ArenaHall}`);
            throw Error(ServerErrCode.NetError + '');
        }
    }

    if (checkReplay) {
        const data = await new Promise<ArenaStatusData | void>(
            (resolve, reject) => {
                arena_hall_socket.event.once(
                    ServerEvent.ErrCode,
                    (res, code) => reject(res?.code || code),
                    null,
                );
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
            },
        );

        if (
            !data ||
            data.roomStatus !== ArenaStatus.ROOM_STATUS_ENABLE ||
            (data.userStatus !== ArenaGameStatus.GAME_STATUS_SIGNUP_OVER &&
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

export function getArenaSocket() {
    return arena_hall_socket;
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

    commonArenaSocket(arena_hall_socket, hall);
}

export function commonArenaSocket(socket: WebSocketTrait, bindObj: any) {
    bindSocketEvent(socket, bindObj, {
        [ArenaEvent.ErrCode]: (res: ErrorData, code: number) => {
            code = res?.code || code;
            arenaErrHandler(code);
        },
        /** 重连 */
        [SocketEvent.Reconnecting]: (try_index: number) => {
            if (try_index === 0) {
                TipPop.tip(tplIntr('NetError'), {
                    count: 10,
                    show_count: true,
                    auto_hide: false,
                    click_through: false,
                    repeat: true,
                });
            }
        },
        /** 重连 */
        [SocketEvent.Reconnected]: () => {
            tipComeBack();
        },
        /** 断开连接 */
        [SocketEvent.End]: () => {
            AlertPop.alert(tplIntr('logoutTip'), {
                hide_cancel: true,
            }).then(() => {
                location.reload();
            });
        },
    });
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
    if (!socket) {
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

export async function arenaErrHandler(code: number) {
    if (code === ArenaErrCode.Maintenance) {
        AppCtrl.event.emit(
            ArenaErrCode.Maintenance,
            tplIntr('maintainQuitTip'),
        );
        return true;
    } else if (code === ArenaErrCode.NoMoney) {
        const errMsg = tplIntr(ServerErrCode.NoMoney);
        return AlertPop.alert(errMsg).then((type) => {
            if (type === 'confirm') {
                const currency =
                    getGameCurrency() || modelState.app.user_info.cur_balance;
                recharge(currency);
            }
        });
    } else if (code === ArenaErrCode.NoOpen) {
        TipPop.tip(tplIntr('gameNoOpen'));
    } else if (code === ArenaErrCode.GameEnded) {
        TipPop.tip(tplIntr('GameEnded'));
    } else if (code === ArenaErrCode.SignUpFail) {
        const errMsg = tplIntr('SignUpFail');
        AppCtrl.event.emit(ArenaErrCode.SignUpFail, errMsg);
    } else if (code === ArenaErrCode.GuestSignUpFail) {
        const errMsg = tplIntr('GuestSignUpFail');
        AppCtrl.event.emit(ArenaErrCode.GuestSignUpFail, errMsg);
    } else if (code === ArenaErrCode.UserSignUpDeadline) {
        AppCtrl.event.emit(
            ArenaErrCode.UserSignUpDeadline,
            tplIntr('UserSignUpDeadline'),
        );
    } else if (code === ArenaErrCode.BulletLack) {
        TipPop.tip(tplIntr('BulletLack'));
    } else if (
        code === ArenaErrCode.BuyGiftFail ||
        code === ArenaErrCode.BuyShopFail
    ) {
        TipPop.tip(tplIntr('BuyFail'));
    } else if (code === ArenaErrCode.ItemNotExist) {
        TipPop.tip(tplIntr('ItemNotExist'));
    } else if (code === ArenaErrCode.GiftOnlyOnce) {
        TipPop.tip(tplIntr('GiftOnlyOnce'));
    }
}
