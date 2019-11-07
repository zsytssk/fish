import { WebSocketTrait } from 'ctrl/net/webSocketWrap';
import { GameCtrl } from './gameCtrl';
import { ServerEvent } from 'data/serverEvent';
import { BombInfo } from 'model/game/skill/bombModel';
import { SkillMap } from 'data/config';
import { FreezeInfo } from 'model/game/skill/freezeModel';
import { TrackFishInfo } from 'model/game/skill/trackFishModel';

export function onGameSocket(socket: WebSocketTrait, game: GameCtrl) {
    bindSocketEvent(socket, game, {
        [ServerEvent.Hit]: (data: HitRep) => {
            game.onHit(data);
        },
        [ServerEvent.UseBomb]: (data: UseBombRep) => {
            game.activeSkill(SkillMap.Bomb, convertBombData(data));
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
        [ServerEvent.FishShoal]: (data: FishShoal) => {},
        [ServerEvent.FishShoalWarn]: (data: FishShoalWarnRep) => {
            game.shoalComingTip(data);
        },
    });
}

function bindSocketEvent(
    socket: WebSocketTrait,
    bind_obj: any,
    bind_info: { [key: string]: Func<void> },
) {
    const { event } = socket;
    for (const key in bind_info) {
        if (!bind_info.hasOwnProperty(key)) {
            continue;
        }
        event.on(key, bind_info[key], bind_obj);
    }
}

function convertBombData(data: UseBombRep): BombInfo {
    const {
        userId: user_id,
        bombPoint: pos,
        count: num,
        killedFish: fish_list,
    } = data;

    return { user_id, pos, num, fish_list };
}
function convertFreezeData(data: UseFreezeRep): FreezeInfo {
    const {
        userId: user_id,
        count: num,
        duration: used_time,
        frozenFishList: fish_list,
    } = data;

    return { user_id, used_time, num, fish_list };
}
function convertUseLockData(data: UseLockRep): TrackFishInfo {
    const {
        userId: user_id,
        count: num,
        duration: used_time,
        lockedFish: fish,
    } = data;

    return { user_id, used_time, num, fish, is_tip: true };
}
function convertLockFishData(data: LockFishReq): TrackFishInfo {
    const { userId: user_id, eid: fish } = data;

    return { user_id, fish };
}
