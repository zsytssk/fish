import { commonSocket, ErrorHandler, offCommon } from 'ctrl/hall/commonSocket';
import { WebSocketTrait } from 'ctrl/net/webSocketWrap';
import { bindSocketEvent } from 'ctrl/net/webSocketWrapUtil';
import { SkillMap } from 'data/config';
import { ServerEvent } from 'data/serverEvent';
import { PlayerInfo } from 'model/game/playerModel';
import { AutoShootInfo } from 'model/game/skill/autoShootModel';
import { BombInfo } from 'model/game/skill/bombModel';
import { FreezeInfo } from 'model/game/skill/freezeModel';
import {
    LockFishActiveInfo,
    LockFishInitInfo,
} from 'model/game/skill/lockFishModel';
import { SkillInfo } from 'model/game/skill/skillCoreCom';
import { getCurUserId, isCurUser } from 'model/modelState';
import { GameCtrl } from './gameCtrl';

let game_socket: WebSocketTrait;
export function onGameSocket(socket: WebSocketTrait, game: GameCtrl) {
    game_socket = socket;
    commonSocket(socket, game);
    bindSocketEvent(socket, game, {
        [ServerEvent.EnterGame]: (data: EnterGameRep) => {
            game.onEnterGame(convertEnterGame(data));
        },
        [ServerEvent.TableIn]: (data: TableInRep) => {
            const user = convertTableInData(data);
            game.addPlayers([user]);
        },
        [ServerEvent.TableOut]: (data: TableOutRep) => {
            game.tableOut(data);
        },
        [ServerEvent.Shoot]: (data: ShootRep) => {
            game.onShoot(data);
        },
        [ServerEvent.Hit]: (data: HitRep, code: number) => {
            if (code !== 200) {
                return ErrorHandler(code);
            }
            game.onHit(data);
        },
        [ServerEvent.FishBomb]: (data: UseBombRep, code: number) => {
            if (code !== 200) {
                game.resetSkill(SkillMap.Bomb, getCurUserId());
                return;
            }
            game.activeSkill(SkillMap.Bomb, convertBombData(data));
        },
        [ServerEvent.UseBomb]: (data: UseBombRep, code: number) => {
            if (code !== 200) {
                game.resetSkill(SkillMap.Bomb, getCurUserId());
                return;
            }
            const _data = convertBombData(data);
            game.activeSkill(SkillMap.Bomb, {
                ..._data,
                is_bomb_fish: true,
            } as BombInfo);
        },
        [ServerEvent.UseFreeze]: (data: UseFreezeRep, code: number) => {
            if (code !== 200) {
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
        [ServerEvent.UseLock]: (data: UseLockRep, code: number) => {
            if (code !== 200) {
                game.resetSkill(SkillMap.Freezing, getCurUserId());
                return;
            }
            game.activeSkill(SkillMap.LockFish, convertUseLockData(data));
        },
        [ServerEvent.LockFish]: (data: LockFishReq, code: number) => {
            if (code !== 200) {
                game.resetSkill(SkillMap.Freezing, getCurUserId());
                return;
            }
            game.activeSkill(SkillMap.LockFish, convertLockFishData(data));
        },
        [ServerEvent.AddFish]: (data: ServerAddFishRep) => {
            game.addFish(data.fish);
        },
        [ServerEvent.FishShoal]: (data: FishShoal) => {
            game.shoalComingTip(data.reverse);
            game.addFish(data.fish);
        },
        [ServerEvent.FishShoalWarn]: (data: FishShoalWarnRep) => {},
        [ServerEvent.RoomOut]: (data: RoomOutRep) => {
            game.roomOut(data);
        },
        [ServerEvent.ChangeTurret]: (data: ChangeTurretRep) => {
            game.changeBulletCost(data);
        },
        [ServerEvent.UseSkin]: (data: UseSkinReq) => {
            game.changeSkin(data.skinId);
        },
    });
}

export function offGameSocket(game: GameCtrl) {
    offCommon(game_socket, game);
    game_socket.event.offAllCaller(game);
}
export function sendToSocket(...params: [string, any?]) {
    game_socket.send(...params);
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
        frozen,
        frozenLeft,
    } = data;
    const users = [] as PlayerInfo[];
    items_template = items;

    /** 用户信息 */
    for (const user_source of users_source) {
        const {
            userId: user_id,
            index,
            bulletNum: bullet_num,
            multiple: bullet_cost,
            turretSkin: gun_skin,
            lockFish,
            lockLeft,
        } = user_source;
        const is_cur_player = isCurUser(user_id);
        const need_emit = isCurUser(user_id);
        const skills = genSkillMap(items, is_cur_player);

        if (lockFish) {
            skills[SkillMap.LockFish] = {
                ...skills[SkillMap.LockFish],
                lock_fish: lockFish,
                lock_left: lockLeft / 1000,
            } as LockFishInitInfo;
        }

        const player_info = {
            user_id,
            server_index: index - 1,
            bullet_num,
            bullet_cost,
            gun_skin: `${Number(gun_skin) - 1000}`,
            nickname: '',
            avatar: '',
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
    if (frozen) {
        for (const fish_item of fish) {
            if (fish_item.frozen) {
                fish_list.push(fish_item.eid);
            }
        }
    }

    return {
        isTrial,
        exchange_rate: rate,
        fish,
        users,
        frozen,
        frozen_left: frozenLeft / 1000,
        fish_list,
    };
}
function convertTableInData(data: TableInRep): PlayerInfo {
    const {
        userId: user_id,
        index: index,
        multiple: bullet_cost,
        turretSkin: gun_skin,
    } = data;
    const skills = genSkillMap(items_template, false);
    return {
        user_id,
        server_index: index - 1,
        bullet_cost,
        gun_skin: `${Number(gun_skin) - 1000}`,
        nickname: '',
        avatar: '',
        bullet_num: 0,
        need_emit: false,
        is_cur_player: false,
        skills,
    };
}
function convertBombData(data: UseBombRep): BombInfo {
    const {
        userId: user_id,
        bombPoint: pos,
        count: num,
        killedFish: fish_list,
    } = data;
    const used_time = 0;
    return { user_id, pos, num, used_time, fish_list };
}
function convertFreezeData(data: UseFreezeRep): FreezeInfo {
    const {
        userId: user_id,
        count: num,
        duration,
        frozenFishList: fish_list,
    } = data;
    const used_time = 0;
    return { user_id, used_time, num, fish_list, duration };
}
function convertAUtoShootData(data: AutoShootRep): AutoShootInfo {
    const { userId: user_id, autoShoot } = data;
    return { user_id, autoShoot };
}
function convertUseLockData(data: UseLockRep): LockFishActiveInfo {
    const {
        userId: user_id,
        count: num,
        // duration: used_time,
        lockedFish: fish,
    } = data;
    const used_time = 0;
    return { user_id, used_time, num, fish, is_tip: true };
}
function convertLockFishData(data: LockFishReq): LockFishActiveInfo {
    const { userId: user_id, eid: fish } = data;
    return { user_id, fish };
}

function genSkillMap(items: ServerItemInfo[], is_cur_player: boolean) {
    const skills = {} as { [key: string]: SkillInfo };
    for (const item of items) {
        const {
            itemId: item_id,
            count: num,
            usedTime: used_time,
            coolTime: cool_time,
        } = item;

        skills[item.itemId] = {
            item_id,
            num: is_cur_player ? Number(num) : 0,
            used_time: is_cur_player ? used_time / 1000 : 0,
            cool_time: cool_time / 1000,
        } as SkillInfo;
    }

    return skills;
}
