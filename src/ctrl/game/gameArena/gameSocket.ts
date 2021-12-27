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
import { commonSocket, errorHandler } from '@app/ctrl/hall/commonSocket';
import { SocketEvent, WebSocketTrait } from '@app/ctrl/net/webSocketWrap';
import { bindSocketEvent } from '@app/ctrl/net/webSocketWrapUtil';
import { SkillMap } from '@app/data/config';
import { ArenaEvent, ServerEvent } from '@app/data/serverEvent';
import { PlayerInfo } from '@app/model/game/playerModel';
import { AutoShootInfo } from '@app/model/game/skill/autoShootModel';
import { BombInfo } from '@app/model/game/skill/bombModel';
import { FreezeInfo } from '@app/model/game/skill/freezeModel';
import {
    LockFishActiveInfo,
    LockFishInitInfo,
} from '@app/model/game/skill/lockFishModel';
import { SkillInfo } from '@app/model/game/skill/skillCoreCom';
import { getCurPlayer, getCurUserId, isCurUser } from '@app/model/modelState';

import { tipExchange } from '../gameCtrlUtils';
import { GameCtrl } from './gameCtrl';

const OK_CODE = 0;
export function onGameSocket(socket: WebSocketTrait, game: GameCtrl) {
    let currency: string;
    commonSocket(socket, game);
    bindSocketEvent(socket, game, {
        [ServerEvent.EnterGame]: (data: EnterGameRep, code: number) => {
            if (code !== OK_CODE) {
                return errorHandler(code, data, socket);
            }
            currency = data.currency;
            game.onEnterGame(convertEnterGame(data));
        },
        [ServerEvent.TableIn]: (data: TableInRep) => {
            const user = convertTableInData(data);
            game.addPlayers([user]);
        },
        [ServerEvent.NeedEmitUser]: (data: NeedEmitUserRep) => {
            if (!isCurUser(data.userId, true)) {
                return;
            }

            game.setPlayersEmit(data.robotIds);
        },
        [ServerEvent.TableOut]: (data: TableOutRep, code: number) => {
            if (code !== OK_CODE) {
                return errorHandler(code, data, socket);
            }
            game.tableOut(data);
        },
        [ServerEvent.Shoot]: (data: ShootRep) => {
            game.onShoot(data);
        },
        [ServerEvent.Hit]: (data: HitRep, code: number) => {
            // Todo
            if (code !== OK_CODE) {
                return errorHandler(code, data, socket);
            }
            game.onHit(data);
        },
        [ServerEvent.UseFreeze]: (data: UseFreezeRep, code: number) => {
            if (code !== OK_CODE) {
                game.resetSkill(SkillMap.Freezing, getCurUserId());
                return;
            }
            game.activeSkill(SkillMap.Freezing, convertFreezeData(data));
        },
        [ServerEvent.autoShoot]: (data: AutoShootRep) => {
            const { autoShoot } = data;
            if (!autoShoot) {
                game.disableSkill(SkillMap.Auto, data.userId);
            } else {
                game.activeSkill(SkillMap.Auto, convertAUtoShootData(data));
            }
        },
        [ServerEvent.LockFish]: (data: LockFishRep, code: number) => {
            if (code !== OK_CODE) {
                game.resetSkill(SkillMap.Freezing, getCurUserId());
                return;
            }
            game.activeSkill(SkillMap.LockFish, convertLockFishData(data));
        },
        [ServerEvent.AddFish]: (data: ServerAddFishRep['fish']) => {
            game.addFish(data);
        },
        [ServerEvent.FishShoal]: (data: FishShoal) => {
            game.shoalComingTip(data.reverse);
            game.addFish(data.fish);
        },
        [ServerEvent.ChangeTurret]: (data: ChangeTurretRep) => {
            game.changeBulletCost(data);
        },
        [ServerEvent.UseSkin]: (data: UseSkinRep) => {
            game.changeSkin(data);
        },
        [ArenaEvent.TriggerTask]: (data: TaskTriggerRes) => {
            game.triggerTask(data);
        },
        [ArenaEvent.TaskRefresh]: (data: TaskRefreshRes) => {
            game.taskRefresh(data);
        },
        [ArenaEvent.TaskFinish]: (data: TaskFinishRes) => {
            game.taskFinish(data);
        },
        [ArenaEvent.GameSettle]: (data: SettleData) => {
            game.GameSettle(data);
        },
        [ServerEvent.ExchangeBullet]: (data: ExchangeBullet, code: number) => {
            // Todo
            if (code !== OK_CODE) {
                return errorHandler(code, data, socket);
            }
            const player = getCurPlayer();
            const cost = player.gun.getAllBulletCost();
            player.updateInfo({
                bullet_num: data.balance - cost,
            });
            tipExchange(data);
        },
        [SocketEvent.Reconnected]: () => {
            game.reset();
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
        isTrial,
        rate,
        users: users_source,
        items,
        fish,
        isFirstStart,
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
            }
            for (const group_item of fish_item.group) {
                fish_list.push(group_item.eid);
            }
        }
    }

    return {
        isTrial,
        exchange_rate: rate,
        fish,
        users,
        frozen,
        isFirstStart,
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
