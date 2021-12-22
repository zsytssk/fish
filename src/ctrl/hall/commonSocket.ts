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
import { InternationalTip } from '@app/data/internationalConfig';
import {
    ErrorData,
    ServerErrCode,
    ServerEvent,
    ServerName,
} from '@app/data/serverEvent';
import { sleep } from '@app/utils/animate';
import { asyncOnly } from '@app/utils/asyncQue';
import { BgMonitorEvent } from '@app/utils/bgMonitor';
import { removeItem } from '@app/utils/localStorage';
import { debug } from '@app/utils/log';
import { tplStr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';
import TipPop from '@app/view/pop/tip';

import { getLang, recharge } from './hallCtrlUtil';
import { login } from './login';

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
                AlertPop.alert(logoutTip, { hide_cancel: true }).then(
                    (type) => {
                        location.reload();
                    },
                );
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
            }).then((type) => {
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
    const lang = getLang();
    const tip = InternationalTip[lang][code];

    if (code === ServerErrCode.ReExchange) {
        return exChangeBullet(tip);
    } else if (code === ServerErrCode.NoMoney) {
        let errMsg = tip;
        if (data?.minAmount) {
            const msg = InternationalTip[lang].NoMoneyAmount;
            const { minAmount, currency } = data as RoomInError;
            errMsg = tplStr(msg, { minAmount, currency });
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
