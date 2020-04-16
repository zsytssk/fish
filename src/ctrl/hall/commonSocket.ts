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

export function commonSocket(socket: WebSocketTrait, bind: any) {
    const { ErrCode } = ServerEvent;
    bindSocketEvent(socket, bind, {
        [ErrCode]: (res: ErrorData) => {
            const lang = getLang();
            const { logoutTip } = InternationalTip[lang];
            if (res.code === ServerErrCode.TokenExpire) {
                disconnectSocket(socket.config.name);
                AlertPop.alert(logoutTip, { hide_cancel: true }).then(type => {
                    location.reload();
                });
            } else if (res.code === ServerErrCode.OtherLogin) {
                disconnectSocket(socket.config.name);
                AlertPop.alert(logoutTip, {
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
            const lang = getLang();
            const { NetComeBack } = InternationalTipOther[lang];
            TipPop.tip(NetComeBack);
        },
        /** 重连 */
        [SocketEvent.Reconnecting]: try_no => {
            const lang = getLang();
            const { NetError } = InternationalTipOther[lang];
            TipPop.tip(NetError, {
                count: 20,
                show_count: true,
                auto_hide: false,
                click_through: false,
            }).then(type => {
                location.reload();
            });
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
}
