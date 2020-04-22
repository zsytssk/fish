import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { ServerName, ServerEvent } from 'data/serverEvent';
import { ShopData } from './shop';
import { LotteryPopData } from './lottery';
import { ctrlState } from 'ctrl/ctrlState';
import { modelState } from 'model/modelState';
import { ChangeUserNumInfo } from 'ctrl/game/gameCtrl';
import { ErrorHandler } from 'ctrl/hall/commonSocket';

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

export function useGunSkin(skin: string) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(ServerEvent.UseSkin, (data: UseSkinReq) => {
            resolve(true);
        });
        socket.send(ServerEvent.UseSkin, { skinId: skin });
    }) as Promise<boolean>;
}
export function buyItem(itemId: string, num?: number, cost_bullet?: number) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(ServerEvent.Buy, (data: BuyRep, code: number) => {
            if (code !== 200) {
                return ErrorHandler(code);
            }

            const userId = modelState.app.user_info.user_id;
            const change_arr = [] as ChangeUserNumInfo['change_arr'];

            if (num) {
                change_arr.push({
                    id: itemId,
                    num,
                    type: 'skill',
                });
            }
            if (-cost_bullet) {
                change_arr.push({
                    num: -cost_bullet * num,
                    type: 'bullet',
                });
            }
            ctrlState.game.changeUserNumInfo({
                userId,
                change_arr,
            });
            resolve(true);
        });
        socket.send(ServerEvent.Buy, { itemId, num } as BuyReq);
    }) as Promise<boolean>;
}

export function getLotteryData(): Promise<LotteryPopData> {
    const get_lottery_list = new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(ServerEvent.LotteryList, (data: LotteryListRep) => {
            resolve(data);
        });
        socket.send(ServerEvent.LotteryList);
    }) as Promise<LotteryListRep>;

    const get_exchange_list = new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(ServerEvent.ExchangeList, (data: ExchangeListRep) => {
            resolve(data);
        });
        socket.send(ServerEvent.ExchangeList);
    }) as Promise<ExchangeListRep>;

    return Promise.all([get_lottery_list, get_exchange_list]).then(
        ([lottery_arr, exchange_arr]) => {
            const { costNum, curNum, list: lottery_list } = lottery_arr;
            const { list: exchange_list } = exchange_arr;
            const {} = exchange_arr;

            const lottery = [] as LotteryPopData['lottery'];
            const exchange = [] as LotteryPopData['exchange'];

            for (const item of lottery_list) {
                lottery.push({
                    lottery_type: item.name,
                    lottery_id: item.id,
                    lottery_num: item.num,
                });
            }
            for (const item of exchange_list) {
                exchange.push({
                    exchange_id: item.itemId,
                    exchange_type: item.name,
                    exchange_num: item.num,
                    cost_num: item.cost,
                    cur_num: item.curNum,
                });
            }
            let radio = curNum / costNum;
            radio = radio > 1 ? 1 : radio;

            return {
                lottery,
                exchange,
                radio,
                lottery_cost: costNum,
                lottery_num: curNum,
            } as LotteryPopData;
        },
    );
}

export function runLottery() {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(ServerEvent.Lottery, (data: LotteryRep, code) => {
            if (code !== 200) {
                return;
            }
            resolve(data.id);
        });
        socket.send(ServerEvent.Lottery);
    }) as Promise<string>;
}

export function runTicketExchange(itemId: string) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(
            ServerEvent.TicketExchange,
            (data: TicketExchangeRep) => {
                resolve(data.itemId);
            },
        );
        socket.send(ServerEvent.TicketExchange, { itemId });
    }) as Promise<string>;
}
