import { ctrlState } from 'ctrl/ctrlState';
import { bindSocketEvent, getSocket } from 'ctrl/net/webSocketWrapUtil';
import { Config } from 'data/config';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { HallCtrl } from './hallCtrl';
import { login } from './login';
import AlertPop from 'view/pop/alert';
import { coingameGetDomain } from 'coingame/coingameUtil';
import { modelState } from 'model/modelState';
import { ShopData } from 'view/pop/shop';
import { res } from 'data/res';

export async function onHallSocket(hall: HallCtrl) {
    await login();

    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.UserAccount,
            (data: UserAccountRep) => {
                hall.onUserAccount(data);
                resolve();
            },
            hall,
        );
        socket.send(ServerEvent.UserAccount, { domain: Config.Host });
    });
}

export async function checkReplay(hall: HallCtrl) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.CheckReplay,
            (data: CheckReplayRep) => {
                const { isReplay, socketUrl } = data;
                if (isReplay) {
                    AlertPop.alert('你当前在游戏中是否重新进入?').then(type => {
                        if (type === 'confirm') {
                            ctrlState.app.enterGame(socketUrl);
                            resolve(true);
                        }
                    });
                    return;
                }
                resolve(false);
            },
            hall,
        );
        socket.send(ServerEvent.CheckReplay);
    });
}

export function roomIn(data: { isTrial: 0 | 1; roomId: number }) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(ServerEvent.RoomIn, (_data: RoomInRep) => {
            ctrlState.app.enterGame(_data.socketUrl);
            resolve();
        });
        const currency = modelState.app.user_info.cur_balance;
        socket.send(ServerEvent.RoomIn, {
            ...data,
            currency,
            domain: coingameGetDomain(),
        } as RoomInReq);
    });
}

export function getShopInfo() {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(ServerEvent.ShopList, (data: ShopListRep) => {
            resolve(genShopInfo(data));
        });
        socket.send(ServerEvent.ShopList);
    }) as Promise<ShopData>;
}

export function genShopInfo(data: ShopListRep): ShopData {
    const result = { gun: [], item: [] } as ShopData;

    for (const item of data) {
        const { type, item_id, status, price, num, name } = item;
        if (type === 1) {
            result.gun.push({
                id: item_id,
                price,
                status,
                name,
            });
        } else {
            result.item.push({
                id: item_id,
                price,
                num,
                name,
            });
        }
    }
    return result;
}
