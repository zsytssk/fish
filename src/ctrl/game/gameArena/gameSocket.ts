import {
    EnterGameRep,
    LockFishRep,
    ServerItemInfo,
    SettleData,
    TableInRep,
    TaskFinishRes,
    TaskRefreshRes,
    TaskTriggerRes,
    UseFreezeRep,
} from '@app/api/arenaApi';
import { arenaErrHandler } from '@app/ctrl/hall/arenaSocket';
import { commonSocket } from '@app/ctrl/hall/commonSocket';
import { SocketEvent, WebSocketTrait } from '@app/ctrl/net/webSocketWrap';
import { bindSocketEvent } from '@app/ctrl/net/webSocketWrapUtil';
import { SkillMap } from '@app/data/config';
import { ArenaEvent, ARENA_OK_CODE, ServerEvent } from '@app/data/serverEvent';
import { PlayerInfo } from '@app/model/game/playerModel';
import { AutoShootInfo } from '@app/model/game/skill/autoShootModel';
import { FreezeInfo } from '@app/model/game/skill/freezeModel';
import {
    LockFishActiveInfo,
    LockFishInitInfo,
} from '@app/model/game/skill/lockFishModel';
import { SkillInfo } from '@app/model/game/skill/skillCoreCom';
import { getCurPlayer, getCurUserId, isCurUser } from '@app/model/modelState';

import { tipExchange } from '../gameCtrlUtils';
import { GameCtrl } from './gameCtrl';

export function onGameSocket(socket: WebSocketTrait, game: GameCtrl) {
    let currency: string;
    commonSocket(socket, game);
    bindSocketEvent(socket, game, {
        [ServerEvent.EnterGame]: (data: EnterGameRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.reset();
            currency = data.currency;
            game.onEnterGame(convertEnterGame(data));
        },
        [ServerEvent.TableIn]: (data: TableInRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            const user = convertTableInData(data);
            game.addPlayers([user]);
        },
        [ServerEvent.NeedEmitUser]: (data: NeedEmitUserRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }

            if (!isCurUser(data.userId, true)) {
                return;
            }
            game.setPlayersEmit(data.robotIds);
        },
        [ServerEvent.TableOut]: (data: TableOutRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.tableOut(data);
        },
        [ServerEvent.Shoot]: (data: ShootRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.onShoot(data);
        },
        [ServerEvent.Hit]: (data: HitRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.onHit(data);
        },
        [ServerEvent.UseFreeze]: (data: UseFreezeRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                const result = arenaErrHandler(game, code, data, socket);
                if (result) {
                    return;
                }
            }

            if (code !== ARENA_OK_CODE) {
                game.resetSkill(SkillMap.Freezing, getCurUserId());
                return;
            }
            game.activeSkill(SkillMap.Freezing, convertFreezeData(data));
        },
        [ServerEvent.autoShoot]: (data: AutoShootRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }

            const { autoShoot } = data;
            if (!autoShoot) {
                game.disableSkill(SkillMap.Auto, data.userId);
            } else {
                game.activeSkill(SkillMap.Auto, convertAUtoShootData(data));
            }
        },
        [ServerEvent.LockFish]: (data: LockFishRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }

            if (code !== ARENA_OK_CODE) {
                game.resetSkill(SkillMap.Freezing, getCurUserId());
                return;
            }
            game.activeSkill(SkillMap.LockFish, convertLockFishData(data));
        },
        [ServerEvent.AddFish]: (
            data: ServerAddFishRep['fish'],
            code: number,
        ) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.addFish(data);
        },
        [ServerEvent.FishShoal]: (data: FishShoal, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.shoalComingTip(data.reverse);
            game.addFish(data.fish);
        },
        [ServerEvent.ChangeTurret]: (data: ChangeTurretRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.changeBulletCost(data);
        },
        [ServerEvent.UseSkin]: (data: UseSkinRep, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.changeSkin(data);
        },
        [ArenaEvent.TriggerTask]: (data: TaskTriggerRes, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.triggerTask(data);
        },
        [ArenaEvent.TaskRefresh]: (data: TaskRefreshRes, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.taskRefresh(data);
        },
        [ArenaEvent.TaskFinish]: (data: TaskFinishRes, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.taskFinish(data);
        },
        [ArenaEvent.GameSettle]: (data: SettleData, code: number) => {
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            game.GameSettle(data);
        },

        [ServerEvent.ExchangeBullet]: (data: ExchangeBullet, code: number) => {
            // Todo
            if (code !== ARENA_OK_CODE) {
                return arenaErrHandler(game, code, data, socket);
            }
            const player = getCurPlayer();
            const cost = player.gun.getAllBulletCost();
            player.updateInfo({
                bullet_num: data.balance - cost,
            });
            tipExchange(data);
        },
        [SocketEvent.Reconnected]: () => {
            socket.send(ServerEvent.EnterGame, { replay: true, currency });
        },
    });
}

export type EnterGameData = {
    fish: ServerFishInfo;
    users: PlayerInfo[];
};
let items_template: ServerItemInfo[];
export function convertEnterGame(data: EnterGameRep) {
    const {
        isGuest,
        rate,
        users: users_source,
        items,
        fish,
        isFirstStart,
        task,
        table: { frozen, frozenLeft },
        currency,
    } = data;
    const users = [] as PlayerInfo[];
    items_template = items;

    /** 用户信息 */
    for (const user_source of users_source) {
        const {
            userId: user_id,
            seatId,
            bulletNum: bullet_num,
            multiple: bullet_cost,
            turretSkin: gun_skin,
            lockFish,
            lockLeft,
            needEmit,
            score,
        } = user_source;
        const is_cur_player = isCurUser(user_id, true);
        const need_emit = isCurUser(user_id, true) || needEmit;
        const skills = genSkillMap(items, is_cur_player);

        if (lockFish) {
            skills[SkillMap.LockFish] = {
                ...skills[SkillMap.LockFish],
                lock_fish: lockFish,
                lock_left: lockLeft / 1000,
                needActive: true,
            } as LockFishInitInfo;
        }

        const player_info = {
            user_id,
            server_index: seatId - 1,
            bullet_num,
            bullet_cost,
            gun_skin: `${Number(gun_skin) - 1000}`,
            nickname: '',
            avatar: '',
            score,
            is_cur_player,
            skills,
            need_emit,
        };

        /** 当前用户放在第一位 */
        if (is_cur_player) {
            users.unshift(player_info);
        } else {
            users.push(player_info);
        }
    }

    /** 提取冰冻的鱼 */
    const fish_list: string[] = [];
    if (frozen && fish) {
        for (const fish_item of fish) {
            if (!fish_item.frozen) {
                continue;
            }
            if (!fish_item.group) {
                fish_list.push(fish_item.eid);
                continue;
            }
            for (const group_item of fish_item.group) {
                fish_list.push(group_item.eid);
            }
        }
    }

    return {
        isTrial: isGuest,
        exchange_rate: rate,
        fish,
        users,
        frozen,
        isFirstStart,
        task,
        currency,
        frozen_left: frozenLeft / 1000,
        fish_list,
    };
}
function convertTableInData(data: TableInRep): PlayerInfo {
    const {
        userId: user_id,
        seatId: index,
        multiple: bullet_cost,
        needEmit: need_emit,
        turretSkin: gun_skin,
        bulletNum: bullet_num,
    } = data;
    const skills = genSkillMap(items_template, false);
    return {
        user_id,
        server_index: index - 1,
        bullet_cost,
        gun_skin: `${Number(gun_skin) - 1000}`,
        nickname: '',
        avatar: '',
        bullet_num: bullet_num || 0,
        need_emit: need_emit || false,
        is_cur_player: false,
        skills,
    };
}

function convertFreezeData(data: UseFreezeRep): FreezeInfo {
    const {
        userId: user_id,
        number: num,
        duration,
        frozenFishList: fish_list,
    } = data;
    const used_time = 0;
    return { user_id, used_time, num, fish_list, duration: duration / 1000 };
}
function convertAUtoShootData(data: AutoShootRep): AutoShootInfo {
    const { userId: user_id, autoShoot } = data;
    return { user_id, autoShoot };
}

function convertLockFishData(data: LockFishRep): LockFishActiveInfo {
    const { userId: user_id, eid: fish, needActive, duration, number } = data;
    return {
        user_id,
        fish,
        needActive,
        duration: duration / 1000,
        used_time: 0,
        num: Number(number),
    };
}

function genSkillMap(items: ServerItemInfo[], is_cur_player: boolean) {
    const skills = {} as { [key: string]: SkillInfo };
    for (const item of items) {
        const {
            itemId: item_id,
            number: num,
            usedTime: used_time,
            coolTime: cool_time,
            duration,
        } = item;

        skills[item.itemId] = {
            item_id,
            num: is_cur_player ? Number(num) : 0,
            used_time: is_cur_player ? used_time / 1000 : 0,
            cool_time: cool_time / 1000,
            duration: duration / 1000,
        } as SkillInfo;
    }

    return skills;
}
