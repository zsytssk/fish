import { WebSocketTrait } from 'ctrl/net/webSocketWrap';
import { GameCtrl } from './gameCtrl';
import { ServerEvent } from 'data/serverEvent';
import { BombInfo } from 'model/game/skill/bombModel';
import { SkillMap, Config } from 'data/config';
import { FreezeInfo } from 'model/game/skill/freezeModel';
import { TrackFishInfo } from 'model/game/skill/trackFishModel';
import { bindSocketEvent } from 'ctrl/net/webSocketWrapUtil';
import { PlayerInfo } from 'model/game/playerModel';
import { SkillInfo } from 'model/game/skill/skillCoreCom';
import { isCurUser } from 'model/modelState';

let game_socket: WebSocketTrait;
export function onGameSocket(socket: WebSocketTrait, game: GameCtrl) {
    game_socket = socket;
    bindSocketEvent(socket, game, {
        [ServerEvent.EnterGame]: (data: EnterGameRep) => {
            const { fish, users } = convertEnterGame(data);
            game.addPlayers(users);
            game.addFish(fish);
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
        [ServerEvent.Hit]: (data: HitRep) => {
            game.onHit(data);
        },
        [ServerEvent.FishBomb]: (data: UseBombRep) => {
            game.activeSkill(SkillMap.Bomb, convertBombData(data));
        },
        [ServerEvent.UseBomb]: (data: UseBombRep) => {
            const _data = convertBombData(data);
            game.activeSkill(SkillMap.Bomb, {
                ..._data,
                is_bomb_fish: true,
            } as BombInfo);
        },
        [ServerEvent.UseFreeze]: (data: UseFreezeRep) => {
            game.activeSkill(SkillMap.Freezing, convertFreezeData(data));
        },
        [ServerEvent.UseLock]: (data: UseLockRep) => {
            game.activeSkill(SkillMap.TrackFish, convertUseLockData(data));
        },
        [ServerEvent.LockFish]: (data: LockFishReq) => {
            game.activeSkill(SkillMap.TrackFish, convertLockFishData(data));
        },
        [ServerEvent.AddFish]: (data: ServerAddFishRep) => {
            game.addFish(data.fish);
        },
        [ServerEvent.FishShoal]: (data: FishShoal) => {
            game.shoalComingTip();
            game.addFish(data.fish);
        },
        [ServerEvent.FishShoalWarn]: (data: FishShoalWarnRep) => {},
        [ServerEvent.TableOut]: (data: TableOutRep) => {
            game.tableOut(data);
        },
        [ServerEvent.RoomOut]: (data: RoomOutRep) => {
            game.roomOut(data);
        },
        [ServerEvent.ChangeTurret]: (data: ChangeTurretRep) => {
            game.changeBulletCost(data);
        },
    });
}

export function offGameSocket(game: GameCtrl) {
    game_socket.event.offAllCaller(game);
}
export function sendToSocket(...params: [string, any?]) {
    game_socket.send(...params);
}

export type EnterGameData = {
    fish: ServerFishInfo;
    users: PlayerInfo[];
};
function convertEnterGame(data: EnterGameRep) {
    const { users: users_source, items, fish } = data;
    const users = [] as PlayerInfo[];
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
            num,
            used_time,
            cool_time,
        } as SkillInfo;
    }

    for (const user_source of users_source) {
        const {
            userId: user_id,
            index: index,
            bulletNum: bullet_num,
            multiple: bullet_cost,
            turretSkin: gun_skin,
        } = user_source;
        const is_cur_player = isCurUser(user_id);
        const need_emit = isCurUser(user_id);
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
        if (isCurUser) {
            users.unshift(player_info);
        } else {
            users.push(player_info);
        }
    }

    return {
        fish,
        users,
    };
}
function convertTableInData(data: TableInRep): PlayerInfo {
    const {
        userId: user_id,
        index: index,
        multiple: bullet_cost,
        turretSkin: gun_skin,
    } = data;
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
        skills: [],
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
        // duration: used_time,
        frozenFishList: fish_list,
    } = data;
    const used_time = 0;
    return { user_id, used_time, num, fish_list };
}
function convertUseLockData(data: UseLockRep): TrackFishInfo {
    const {
        userId: user_id,
        count: num,
        // duration: used_time,
        lockedFish: fish,
    } = data;
    const used_time = 0;
    return { user_id, used_time, num, fish, is_tip: true };
}
function convertLockFishData(data: LockFishReq): TrackFishInfo {
    const { userId: user_id, eid: fish } = data;

    return { user_id, fish };
}
