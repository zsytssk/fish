import { WebSocketTrait, SocketEvent } from 'ctrl/net/webSocketWrap';
import { bindSocketEvent, disconnectSocket } from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent, ServerErrCode, ErrorData } from 'data/serverEvent';
import {
    InternationalTip,
    InternationalTipOther,
} from 'data/internationalConfig';
import { getLang } from './hallCtrlUtil';
import AlertPop from 'view/pop/alert';
import TipPop from 'view/pop/tip';
import { ctrlState } from 'ctrl/ctrlState';
import { BgMonitorEvent } from 'utils/bgMonitor';

export function commonSocket(socket: WebSocketTrait, bindObj: any) {
    const { ErrCode } = ServerEvent;
    bindSocketEvent(socket, bindObj, {
        [ErrCode]: (res: ErrorData) => {
            const lang = getLang();
            const { logoutTip } = InternationalTip[lang];
            const { OtherLogin } = InternationalTipOther[lang];
            if (res.code === ServerErrCode.TokenExpire) {
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
            const { NetError } = InternationalTipOther[lang];
            TipPop.tip(NetError, {
                count: 20,
                show_count: true,
                auto_hide: false,
                click_through: false,
            });
        },
        /** 重连 */
        [SocketEvent.Reconnected]: (try_no: number) => {
            tipComeBack();
        },
        /** 重连 */
        [SocketEvent.Reconnecting]: try_no => {
            const lang = getLang();
            const { NetError } = InternationalTipOther[lang];
            tipCount(NetError, 20);
        },
        /** 断开连接 */
        [SocketEvent.End]: (res: ErrorData) => {
            const lang = getLang();
            const { logoutTip } = InternationalTip[lang];
            AlertPop.alert(logoutTip, { hide_cancel: true }).then(type => {
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
    socket.event.offAllCaller(bindObj);
    const { bg_monitor } = ctrlState.app;
    bg_monitor.event.offAllCaller(bindObj);
}

export function ErrorHandler(code: number) {
    const lang = getLang();
    const tip = InternationalTipOther[lang][code];
    if (tip) {
        TipPop.tip(tip);
    }
}

export function tipComeBack() {
    const lang = getLang();
    const { NetComeBack } = InternationalTipOther[lang];
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
