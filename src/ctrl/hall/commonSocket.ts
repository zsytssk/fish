import { ctrlState, getGameCurrency } from '@app/ctrl/ctrlState';
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
import { modelState } from '@app/model/modelState';
import { asyncOnly } from '@app/utils/asyncQue';
import { BgMonitorEvent } from '@app/utils/bgMonitor';
import { removeItem } from '@app/utils/localStorage';
import { tplIntr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';
import TipPop from '@app/view/pop/tip';

import { recharge } from './hallCtrlUtil';
import { login } from './login';

export function commonSocket(socket: WebSocketTrait, bindObj: any) {
    bindSocketEvent(socket, bindObj, {
        [ServerEvent.ErrCode]: (res: ErrorData, code: number) => {
            code = res?.code || code;
            if (code === ServerErrCode.TokenExpire) {
                disconnectSocket(socket.config.name);
                tokenExpireTip();
            } else if (code === ServerErrCode.OtherLogin) {
                disconnectSocket(socket.config.name);
                AlertPop.alert(tplIntr('OtherLogin'), {
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

export function errorHandler(
    code: number,
    data?: any,
    socket?: WebSocketTrait,
) {
    const tip = tplIntr(code);

    if (code === ServerErrCode.Maintaining) {
        platform.hideLoading();

        AlertPop.alert(tplIntr('maintainTip'), {
            hide_cancel: true,
        }).then(() => {
            if (socket.config.name === 'game') {
                socket.send(ServerEvent.RoomOut);
            }
            setTimeout(() => {
                location.reload();
            });
        });
    } else if (code === ServerErrCode.ReExchange) {
        return exChangeBullet(tplIntr(ServerErrCode.ReExchange), socket);
    } else if (code === ServerErrCode.NoMoney) {
        let errMsg = tplIntr(ServerErrCode.NoMoney);
        if (data?.minAmount) {
            const { minAmount, currency } = data as RoomInError;
            errMsg = tplIntr('NoMoneyAmount', { minAmount, currency });
        }
        return AlertPop.alert(errMsg).then((type) => {
            if (type === 'confirm') {
                const currency =
                    getGameCurrency() || modelState.app.user_info.cur_balance;
                recharge(currency);
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
        return TipPop.tip(tplIntr(ServerErrCode.TrialTimeGame));
    } else if (code === ServerErrCode.TrialClose) {
        return TipPop.tip(tplIntr(ServerErrCode.TrialClose));
    } else if (
        code === ServerErrCode.NetError ||
        code === ServerErrCode.EnterGameError
    ) {
        return AlertPop.alert(tplIntr(ServerErrCode.NetError), {
            hide_cancel: true,
        }).then(() => {
            location.reload();
        });
    } else if (code === ServerErrCode.OverLimit) {
        return AlertPop.alert(tplIntr(ServerErrCode.OverLimit), {
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

export function tokenExpireTip() {
    removeItem('local_token');
    AlertPop.alert(tplIntr('logoutTip'), {
        hide_cancel: true,
    }).then(() => {
        location.reload();
    });
}

export function tipComeBack() {
    TipPop.tip(tplIntr('NetComeBack'));
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
export async function exChangeBullet(tip: string, socket: WebSocketTrait) {
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
