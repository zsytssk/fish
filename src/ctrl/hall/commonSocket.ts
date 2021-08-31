import { ctrlState } from 'ctrl/ctrlState';
import {
    disableCurUserOperation,
    waitGameExchangeOrLeave,
} from 'ctrl/game/gameCtrlUtils';
import { sendToGameSocket } from 'ctrl/game/gameSocket';
import { SocketEvent, WebSocketTrait } from 'ctrl/net/webSocketWrap';
import {
    bindSocketEvent,
    disconnectSocket,
    getSocket,
} from 'ctrl/net/webSocketWrapUtil';
import { InternationalTip } from 'data/internationalConfig';
import {
    ErrorData,
    ServerErrCode,
    ServerEvent,
    ServerName,
} from 'data/serverEvent';
import { BgMonitorEvent } from 'utils/bgMonitor';
import AlertPop from 'view/pop/alert';
import TipPop from 'view/pop/tip';
import { getLang, recharge } from './hallCtrlUtil';
import { asyncOnly } from 'utils/asyncQue';
import { removeItem } from 'utils/localStorage';
import { debug } from 'utils/log';
import { login } from './login';
import { tplStr } from 'utils/utils';
import { sleep } from 'utils/animate';

export function commonSocket(socket: WebSocketTrait, bindObj: any) {
    const { ErrCode } = ServerEvent;
    bindSocketEvent(socket, bindObj, {
        [ErrCode]: (res: ErrorData) => {
            const lang = getLang();
            const { logoutTip } = InternationalTip[lang];
            const { OtherLogin } = InternationalTip[lang];
            if (res.code === ServerErrCode.TokenExpire) {
                removeItem('local_token');
                disconnectSocket(socket.config.name);
                AlertPop.alert(logoutTip, { hide_cancel: true }).then(type => {
                    location.reload();
                });
            } else if (res.code === ServerErrCode.OtherLogin) {
                disconnectSocket(socket.config.name);
                AlertPop.alert(OtherLogin, {
                    hide_cancel: true,
                }).then(() => {
                    location.reload();
                });
            }
        },
        /** 重连 */
        [SocketEvent.Reconnecting]: (try_no: number) => {
            const lang = getLang();
            if (try_no !== 0) {
                return;
            }
            const { NetError } = InternationalTip[lang];
            TipPop.tip(NetError, {
                count: 20,
                show_count: true,
                auto_hide: false,
                click_through: false,
            });
        },
        /** 重连 */
        [SocketEvent.Reconnected]: () => {
            tipComeBack();
        },
        /** 断开连接 */
        [SocketEvent.End]: () => {
            const lang = getLang();
            const { logoutTip } = InternationalTip[lang];

            AlertPop.alert(logoutTip, {
                hide_cancel: true,
            }).then(type => {
                location.reload();
            });
        },
    });

    const { bg_monitor } = ctrlState.app;
    bg_monitor.event.on(
        BgMonitorEvent.VisibleChange,
        status => {
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

export function errorHandler(code: number, data?: any) {
    const lang = getLang();
    const tip = InternationalTip[lang][code];

    if (code === ServerErrCode.ReExchange) {
        return exChangeBullet(tip);
    } else if (code === ServerErrCode.NoMoney) {
        let errMsg = tip;
        if (data && data.minAmount) {
            const msg = InternationalTip[lang].NoMoneyAmount;
            const { minAmount, currency } = data as RoomInError;
            errMsg = tplStr(msg, { minAmount, currency });
        }
        return AlertPop.alert(errMsg).then(type => {
            if (type === 'confirm') {
                recharge();
            }
            sendToGameSocket(ServerEvent.RoomOut);
        });
    } else if (code === ServerErrCode.NeedLogin) {
        return login();
    } else if (
        code === ServerErrCode.TrialTimeGame ||
        code === ServerErrCode.TrialNotBullet
    ) {
        return AlertPop.alert(InternationalTip[lang][code], {
            hide_cancel: true,
        }).then(() => {
            const socket = getSocket(ServerName.Game);
            socket.send(ServerEvent.RoomOut);
        });
    } else if (code === ServerErrCode.TrialTimeHall) {
        return TipPop.tip(InternationalTip[lang][ServerErrCode.TrialTimeGame]);
    } else if (code === ServerErrCode.TrialClose) {
        return TipPop.tip(InternationalTip[lang][ServerErrCode.TrialClose]);
    } else if (
        code === ServerErrCode.NetError ||
        code === ServerErrCode.EnterGameError
    ) {
        return AlertPop.alert(InternationalTip[lang][ServerErrCode.NetError], {
            hide_cancel: true,
        }).then(() => {
            location.reload();
        });
    } else if (code === ServerErrCode.OverLimit) {
        return AlertPop.alert(InternationalTip[lang][code], {
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
    const lang = getLang();
    const { NetComeBack } = InternationalTip[lang];
    TipPop.tip(NetComeBack);
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
export async function exChangeBullet(tip: string) {
    disableCurUserOperation();
    if (onExchanging) {
        return;
    }

    onExchanging = true;
    waitGameExchangeOrLeave().then(() => {
        onExchanging = false;
    });
    return asyncOnly(tip, () => {
        return AlertPop.alert(tip, { closeOnSide: false }).then(type => {
            if (type === 'confirm') {
                return sendToGameSocket(ServerEvent.ExchangeBullet);
            }
            sendToGameSocket(ServerEvent.RoomOut);
        });
    });
}
