import { ctrlState } from '@app/ctrl/ctrlState';
import {
    disableCurUserOperation,
    waitGameExchangeOrLeave,
} from '@app/ctrl/game/gameCtrlUtils';
import { SocketEvent, WebSocketTrait } from '@app/ctrl/net/webSocketWrap';
import {
    bindSocketEvent,
    disconnectSocket,
    getSocket,
} from '@app/ctrl/net/webSocketWrapUtil';
import {
    ErrorData,
    ServerErrCode,
    ServerEvent,
    ServerName,
} from '@app/data/serverEvent';
import { asyncOnly } from '@app/utils/asyncQue';
import { BgMonitorEvent } from '@app/utils/bgMonitor';
import { removeItem } from '@app/utils/localStorage';
import { tplStr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';
import TipPop from '@app/view/pop/tip';

import { recharge } from './hallCtrlUtil';
import { login } from './login';

export function commonSocket(socket: WebSocketTrait, bindObj: any) {
    const { ErrCode } = ServerEvent;
    bindSocketEvent(socket, bindObj, {
        [ErrCode]: (res: ErrorData, code: number) => {
            code = res.code || code;
            if (code === ServerErrCode.TokenExpire) {
                removeItem('local_token');
                disconnectSocket(socket.config.name);
                AlertPop.alert(tplStr('logoutTip'), { hide_cancel: true }).then(
                    (type) => {
                        location.reload();
                    },
                );
            } else if (code === ServerErrCode.OtherLogin) {
                disconnectSocket(socket.config.name);
                AlertPop.alert(tplStr('OtherLogin'), {
                    hide_cancel: true,
                }).then(() => {
                    location.reload();
                });
            }
        },
        /** 重连 */
        [SocketEvent.Reconnecting]: (try_index: number) => {
            console.log(`test:>Reconnecting`, try_index);
            if (try_index === 0) {
                TipPop.tip(tplStr('logoutTip'), {
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
            AlertPop.alert(tplStr('logoutTip'), {
                hide_cancel: true,
            }).then(() => {
                location.reload();
            });
        },
    });

    const { bg_monitor } = ctrlState.app;
    bg_monitor.event.on(
        BgMonitorEvent.VisibleChange,
        (status) => {
            if (status) {
                if (socket.status === 'OPEN') {
                    tipComeBack();
                } else {
                    socket.reconnect();
                }
            }
        },
        bindObj,
    );
}

export function offCommon(socket: WebSocketTrait, bindObj: any) {
    socket?.event.offAllCaller(bindObj);
    const { bg_monitor } = ctrlState.app;
    bg_monitor.event.offAllCaller(bindObj);
}

export function errorHandler(code: number, data: any, socket?: WebSocketTrait) {
    const tip = tplStr(code);

    if (code === ServerErrCode.ReExchange) {
        return exChangeBullet(tplStr(ServerErrCode.ReExchange));
    } else if (code === ServerErrCode.NoMoney) {
        let errMsg = tplStr(ServerErrCode.NoMoney);
        if (data?.minAmount) {
            const { minAmount, currency } = data as RoomInError;
            errMsg = tplStr('NoMoneyAmount', { minAmount, currency });
        }
        return AlertPop.alert(errMsg).then((type) => {
            if (type === 'confirm') {
                recharge();
            }
            socket?.send(ServerEvent.RoomOut);
        });
    } else if (code === ServerErrCode.NeedLogin) {
        return login();
    } else if (
        code === ServerErrCode.TrialTimeGame ||
        code === ServerErrCode.TrialNotBullet
    ) {
        return AlertPop.alert(tip, {
            hide_cancel: true,
        }).then(() => {
            const socket = getSocket(ServerName.Game);
            socket.send(ServerEvent.RoomOut);
        });
    } else if (code === ServerErrCode.TrialTimeHall) {
        return TipPop.tip(tplStr(ServerErrCode.TrialTimeGame));
    } else if (code === ServerErrCode.TrialClose) {
        return TipPop.tip(tplStr(ServerErrCode.TrialClose));
    } else if (
        code === ServerErrCode.NetError ||
        code === ServerErrCode.EnterGameError
    ) {
        return AlertPop.alert(tplStr(ServerErrCode.NetError), {
            hide_cancel: true,
        }).then(() => {
            location.reload();
        });
    } else if (code === ServerErrCode.OverLimit) {
        return AlertPop.alert(tplStr(ServerErrCode.OverLimit), {
            hide_cancel: true,
        }).then(() => {
            const socket = getSocket(ServerName.Game);
            socket?.send(ServerEvent.RoomOut);
        });
    }
    if (tip) {
        TipPop.tip(tip);
    }
}

export function tipComeBack() {
    TipPop.tip(tplStr('NetComeBack'));
}
export function tipCount(msg: string, count: number) {
    TipPop.tip(msg, {
        count,
        show_count: true,
        auto_hide: false,
        click_through: false,
    });
}

let onExchanging = false;
export async function exChangeBullet(tip: string, socket?: WebSocketTrait) {
    disableCurUserOperation();
    if (onExchanging) {
        return;
    }

    onExchanging = true;
    waitGameExchangeOrLeave().then(() => {
        onExchanging = false;
    });
    return asyncOnly(tip, () => {
        return AlertPop.alert(tip, { closeOnSide: false }).then((type) => {
            if (type === 'confirm') {
                return socket.send(ServerEvent.ExchangeBullet);
            }
            socket.send(ServerEvent.RoomOut);
        });
    });
}
