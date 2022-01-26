import { ctrlState } from '@app/ctrl/ctrlState';
import { SocketEvent, WebSocketTrait } from '@app/ctrl/net/webSocketWrap';
import {
    bindSocketEvent,
    disconnectSocket,
} from '@app/ctrl/net/webSocketWrapUtil';
import { ErrorData, ServerErrCode, ServerEvent } from '@app/data/serverEvent';
import { asyncOnly } from '@app/utils/asyncQue';
import { BgMonitorEvent } from '@app/utils/bgMonitor';
import { removeItem } from '@app/utils/localStorage';
import { tplIntr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';
import TipPop from '@app/view/pop/tip';

import { AppCtrl } from '../appCtrl';
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
                tipOtherLogin();
            }
        },
        /** 重连 */
        [SocketEvent.Reconnecting]: (try_index: number) => {
            if (try_index === 0) {
                tipReconnect();
            }
        },
        /** 重连 */
        [SocketEvent.Reconnected]: () => {
            tipComeBack(true);
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

export function offCommon(socket: WebSocketTrait, bindObj: any) {
    socket?.event.offAllCaller(bindObj);
}

export function errorHandler(code: number, data?: any) {
    const tip = tplIntr(code);

    if (code === ServerErrCode.Maintaining) {
        platform.hideLoading();
        AppCtrl.event.emit(ServerErrCode.Maintaining, tplIntr('maintainTip'));
    } else if (code === ServerErrCode.ReExchange) {
        return AppCtrl.event.emit(
            ServerErrCode.ReExchange,
            tplIntr(ServerErrCode.ReExchange),
        );
    } else if (code === ServerErrCode.NoMoney) {
        let errMsg = tplIntr(ServerErrCode.NoMoney);

        if (data?.minAmount) {
            const { minAmount, currency } = data as RoomInError;
            errMsg = tplIntr('NoMoneyAmount', { minAmount, currency });
        }
        return AppCtrl.event.emit(ServerErrCode.NoMoney, errMsg);
    } else if (code === ServerErrCode.NeedLogin) {
        return login();
    } else if (
        code === ServerErrCode.TrialTimeGame ||
        code === ServerErrCode.TrialNotBullet
    ) {
        return AppCtrl.event.emit(ServerErrCode.TrialTimeGame, tip);
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
        return AppCtrl.event.emit(
            ServerErrCode.OverLimit,
            tplIntr(ServerErrCode.OverLimit),
        );
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

let tip_pop: TipPop;
export function tipReconnect() {
    TipPop.tip(tplIntr('NetError'), {
        count: 20,
        show_count: true,
        auto_hide: false,
        click_through: false,
        repeat: true,
        on_instance_create: (pop) => (tip_pop = pop),
    });
}

export function tipOtherLogin() {
    asyncOnly('OtherLogin', () => {
        return AlertPop.alert(tplIntr('OtherLogin'), {
            hide_cancel: true,
        }).then(() => {
            location.reload();
        });
    });
}

export function tipComeBack(stopReconnectTip = false) {
    if (stopReconnectTip) {
        tip_pop?.stopCountAndClose();
    }
    TipPop.tip(tplIntr('NetComeBack'), { count: 2 }, { use_exist: true });
}

export function tipCount(msg: string, count: number) {
    TipPop.tip(msg, {
        count,
        show_count: true,
        auto_hide: false,
        click_through: false,
    });
}
