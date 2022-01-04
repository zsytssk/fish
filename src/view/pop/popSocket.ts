import {
    ArenaAwardListReq,
    ArenaAwardListRes,
    BuyGiftRep,
    BuyGoodsData,
    CompetitionInfo,
    GetDayRanking,
    GetHallOfFameData,
    GetRuleData,
    GiftList,
    MatchListRes,
    ShopListData,
    ShopListDataItem,
    SignUpReq,
    SignUpRes,
} from '@app/api/arenaApi';
import { ChangeUserNumInfo } from '@app/ctrl/game/gameCtrl';
import { changeUserAccount, getItemType } from '@app/ctrl/game/gameCtrlUtils';
import { arenaErrHandler } from '@app/ctrl/hall/arenaSocket';
import { errorHandler } from '@app/ctrl/hall/commonSocket';
import { getSocket } from '@app/ctrl/net/webSocketWrapUtil';
import {
    ArenaEvent,
    ARENA_OK_CODE,
    ServerEvent,
    ServerName,
} from '@app/data/serverEvent';
import { getCurUserId, modelState } from '@app/model/modelState';
import { getItem, setItem } from '@app/utils/localStorage';

import { ArenaShopPopInfo } from './arenaShop';
import { LotteryPopData } from './lottery';
import { ShopData } from './shop';

export function getShopInfo() {
    return new Promise((resolve, _reject) => {
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
    return new Promise((resolve, _reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(ServerEvent.UseSkin, (data: UseSkinReq) => {
            resolve(true);
        });
        socket.send(ServerEvent.UseSkin, {
            skinId: skin,
            userId: getCurUserId(),
        });
    }) as Promise<boolean>;
}

export function buyItem(itemId: string, num?: number, cost_bullet?: number) {
    return new Promise((resolve, _reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(ServerEvent.Buy, (data: BuyRep, code: number) => {
            if (code !== 200) {
                return errorHandler(code, data, socket);
            }

            const userId = getCurUserId();
            const change_arr = [] as ChangeUserNumInfo['change_arr'];

            if (num) {
                change_arr.push({
                    id: itemId,
                    num,
                    type: 'skill',
                });
            }
            if (cost_bullet) {
                change_arr.push({
                    num: -cost_bullet * num,
                    type: 'bullet',
                });
            }
            changeUserAccount(userId, change_arr);
            resolve(true);
        });
        socket.send(ServerEvent.Buy, { itemId, num } as BuyReq);
    }) as Promise<boolean>;
}

export function getLotteryData(): Promise<LotteryPopData> {
    const get_lottery_list = new Promise((resolve, _reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(ServerEvent.LotteryList, (data: LotteryListRep) => {
            resolve(data);
        });
        socket.send(ServerEvent.LotteryList);
    }) as Promise<LotteryListRep>;

    const get_exchange_list = new Promise((resolve, _reject) => {
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
    return new Promise((resolve, _reject) => {
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
    return new Promise((resolve, _reject) => {
        const socket = getSocket(ServerName.Game);
        socket.event.once(
            ServerEvent.TicketExchange,
            (data: TicketExchangeRep) => {
                resolve(data);
            },
        );
        socket.send(ServerEvent.TicketExchange, { itemId });
    }) as Promise<TicketExchangeRep>;
}

export function getItemList(data: GetItemListReq) {
    return new Promise((resolve, _reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(ServerEvent.GetItemList, (_data: GetItemListRep) => {
            resolve(_data);
        });
        socket.send(ServerEvent.GetItemList, { ...data });
    }) as Promise<GetItemListRep>;
}
export function getBulletList(data: GetBulletReq) {
    return new Promise((resolve, _reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.GetBulletList,
            (_data: GetBulletListRep) => {
                resolve(_data);
            },
        );
        socket.send(ServerEvent.GetBulletList, {
            ...data,
        });
    }) as Promise<GetBulletListRep>;
}
export function getRecentBullet() {
    return new Promise((resolve, _reject) => {
        const socket = getSocket(ServerName.Hall);
        socket.event.once(
            ServerEvent.GetRecentBullet,
            (_data: GetRecentBulletRep) => {
                resolve(_data);
            },
        );
        socket.send(ServerEvent.GetRecentBullet);
    }) as Promise<GetRecentBulletRep>;
}

export function getCompetitionInfo(currency: string) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        if (!socket) {
            return reject(undefined);
        }
        socket.event.once(
            ArenaEvent.CompetitionInfo,
            (_data: CompetitionInfo, code: number) => {
                if (code !== ARENA_OK_CODE) {
                    arenaErrHandler(null, code);
                    reject(code);
                    return;
                }
                resolve(_data);
            },
        );
        socket.send(ArenaEvent.CompetitionInfo, {
            currency,
        });
    }) as Promise<CompetitionInfo>;
}

/** Arena 报名 */
export function competitionSignUp(currency?: string) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        socket.event.once(ArenaEvent.SignUp, (data: SignUpRes, code) => {
            resolve({
                code,
                currency: currency || modelState.app.user_info.cur_balance,
                ...data,
            });
        });
        socket.send(ArenaEvent.SignUp, {
            currency: modelState.app.user_info.cur_balance,
        } as SignUpReq);
    }) as Promise<SignUpRes>;
}
/** Arena 排名 getDayRanking */
export function arenaGetDayRanking() {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        if (!socket) {
            return reject(undefined);
        }
        socket.event.once(
            ArenaEvent.GetDayRanking,
            (data: GetDayRanking, code) => {
                if (code !== ARENA_OK_CODE) {
                    arenaErrHandler(null, code);
                    reject();
                } else {
                    resolve(data);
                }
            },
        );
        socket.send(ArenaEvent.GetDayRanking);
    }) as Promise<GetDayRanking>;
}
/** Arena 礼包 giftList */
export function arenaGiftList() {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        if (!socket) {
            return reject(undefined);
        }
        socket.event.once(ArenaEvent.GiftList, (data: GiftList, code) => {
            if (code !== ARENA_OK_CODE) {
                arenaErrHandler(null, code);
                reject();
            } else {
                resolve(data);
            }
        });
        socket.send(ArenaEvent.GiftList);
    }) as Promise<GiftList>;
}
/** Arena 礼包 giftList */
export function arenaBuyGift() {
    return new Promise<void>((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        if (!socket) {
            return reject();
        }
        socket.event.once(ArenaEvent.BuyGift, (data: BuyGiftRep, code) => {
            if (code !== ARENA_OK_CODE) {
                arenaErrHandler(null, code);
            } else {
                const userId = getCurUserId(true);
                const change_arr: ChangeUserNumInfo['change_arr'] = [];
                for (const item of data) {
                    const { itemId, num } = item;
                    change_arr.push({
                        id: itemId,
                        num,
                        type: getItemType(itemId),
                    });
                }
                changeUserAccount(userId, change_arr);
                resolve();
            }
        });
        socket.send(ArenaEvent.BuyGift);
    });
}
/** Arena 礼包 giftList */
export function arenaGetHallOfFame(modeId: number) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        if (!socket) {
            return reject(undefined);
        }
        socket.event.once(
            ArenaEvent.GetHallOfFame,
            (data: GetHallOfFameData, code) => {
                if (code !== ARENA_OK_CODE) {
                    arenaErrHandler(null, code);
                    reject();
                } else {
                    resolve(data);
                }
            },
        );
        socket.send(ArenaEvent.GetHallOfFame, { modeId });
    }) as Promise<GetHallOfFameData>;
}

/** Arena 帮助 */
export function arenaGetRuleData(modeId: number, currency: string) {
    const tmp = getItem(`arenaGetRuleData:mode${modeId}`);
    if (tmp) {
        return Promise.resolve(JSON.parse(tmp) as GetRuleData);
    }

    return new Promise<GetRuleData>((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        if (!socket) {
            return reject(undefined);
        }
        socket.event.once(ArenaEvent.GetRuleData, (data: GetRuleData, code) => {
            if (code !== ARENA_OK_CODE) {
                arenaErrHandler(null, code);
                reject();
            } else {
                setItem(
                    `arenaGetRuleData:mode${modeId}`,
                    JSON.stringify(data),
                    1,
                );
                resolve(data);
            }
        });
        socket.send(ArenaEvent.GetRuleData, { modeId, currency });
    });
}

export type ArenaShopList = {
    gun: ShopListDataItem[];
    item: ShopListDataItem[];
};
/** Arena 商城 */
export function arenaShopList(data: ArenaShopPopInfo) {
    return new Promise<ArenaShopList>((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        if (!socket) {
            return reject(undefined);
        }
        socket.event.once(ArenaEvent.ShopList, (data: ShopListData, code) => {
            if (code !== ARENA_OK_CODE) {
                arenaErrHandler(null, code);
                reject();
            } else {
                resolve(arenaGenShopInfo(data));
            }
        });
        socket.send(ArenaEvent.ShopList, data);
    });
}

export function arenaGenShopInfo(data: ShopListData) {
    const result = { gun: [], item: [] } as ArenaShopList;

    for (const item of data) {
        const { itemType } = item;
        if (itemType === 1) {
            result.gun.push(item);
        } else {
            result.item.push(item);
        }
    }
    return result;
}

export function arenaUseGunSkin(skin: string) {
    return new Promise((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        socket.event.once(
            ServerEvent.UseSkin,
            (data: UseSkinReq, code: number) => {
                if (code !== ARENA_OK_CODE) {
                    arenaErrHandler(null, code, data, socket);
                    reject();
                    return;
                }
                resolve(true);
            },
        );
        socket.send(ServerEvent.UseSkin, {
            skinId: skin,
            userId: getCurUserId(true),
        });
    }) as Promise<boolean>;
}

export function arenaBuyItem(id: string, itemId: string, num = 1) {
    return new Promise<boolean>((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        socket.event.once(ArenaEvent.BuyGoods, (data: BuyRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                arenaErrHandler(null, code, data, socket);
                reject();
                return;
            }

            // 更新技能数量
            changeUserAccount(getCurUserId(), [
                { id: itemId, num, type: getItemType(itemId) },
            ]);

            resolve(true);
        });
        socket.send(ArenaEvent.BuyGoods, { id, num } as BuyGoodsData);
    });
}

export function arenaAwardList(params: ArenaAwardListReq) {
    return new Promise<ArenaAwardListRes>((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        socket.event.once(
            ArenaEvent.AwardList,
            (data: ArenaAwardListRes, code: number) => {
                if (code !== ARENA_OK_CODE) {
                    arenaErrHandler(null, code, data, socket);
                    reject();
                    return;
                }

                resolve(data);
            },
        );
        socket.send(ArenaEvent.AwardList, params);
    });
}
export function arenaMatchList(modeId: number) {
    return new Promise<MatchListRes>((resolve, reject) => {
        const socket = getSocket(ServerName.ArenaHall);
        socket.event.once(
            ArenaEvent.MatchList,
            (data: MatchListRes, code: number) => {
                if (code !== ARENA_OK_CODE) {
                    arenaErrHandler(null, code, data, socket);
                    reject();
                    return;
                }

                resolve(data);
            },
        );
        socket.send(ArenaEvent.MatchList, { modeId });
    });
}
