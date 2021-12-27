import SAT from 'sat';

import { Config } from '@app/data/config';
import { FishSpriteInfo } from '@app/data/sprite';
import { getCollisionAllFish, getFishById } from '@app/model/modelState';
import { getSpriteInfo, isBombFish } from '@app/utils/dataUtil';
import { createFishDisplace } from '@app/utils/displace/displaceUtil';
import { error } from '@app/utils/log';

import { BodyCom } from '../com/bodyCom';
import { DisplaceMoveCom } from '../com/moveCom/displaceMoveCom';
import { GameModel } from '../gameModel';
import { PlayerModel, CaptureGain } from '../playerModel';
import { FishBombCom } from './fishBombCom';
import { FishModel, FishData, FishEvent } from './fishModel';

/** 创建鱼 move_com在外面创建 */
export function createFish(data: ServerFishInfo, game: GameModel): FishModel {
    const { eid: id, fishId: type, score, currencyFish } = data;
    const displace = createFishDisplace(data);
    if (!displace) {
        return;
    }
    const move_com = new DisplaceMoveCom(displace);
    const fish_data: FishData = {
        id,
        type,
        score,
        currency: currencyFish,
    };
    const fish = new FishModel(fish_data, game);
    fish.setMoveCom(move_com);
    if (isBombFish(fish)) {
        fish.addCom(new FishBombCom(fish));
    }
    return fish;
}

export type MoveUpdateComposeFn = (move_info: MoveInfo) => MoveInfo;
type FishGroupItemUpdate = {
    id: number;
    update_fn: MoveUpdateFn;
    isStop: boolean;
};
/** 创建鱼组 */
export function createFishGroup(
    data: ServerFishInfo,
    game: GameModel,
): FishModel[] {
    const { fishId: groupType, group, score, currencyFish } = data;
    const result = [] as FishModel[];
    const { group: sprite_group } = getSpriteInfo(
        'fish',
        groupType,
    ) as FishSpriteInfo;
    if (!sprite_group) {
        return result;
    }
    const displace = createFishDisplace(data);
    const move_com = new DisplaceMoveCom(displace);
    const size = group.length;
    /**  onUpdate + destroy 需要提前处理,
     * onUpdate 在原来的update基础上需要加上相对的 pos
     * destroy 只有所有的鱼个都 destroy 就把原来的 move_com destroy
     */
    const update_fn_map: Map<number, FishGroupItemUpdate> = new Map();
    const createUpdateFn = (fn: MoveUpdateComposeFn, index: number) => {
        return [
            (sub_fn: MoveUpdateFn) => {
                // onUpdate
                update_fn_map.set(index, {
                    update_fn: (move_info: MoveInfo) => {
                        const _move_info = fn(move_info);
                        sub_fn(_move_info);
                    },
                    id: index,
                    isStop: undefined,
                });
            },
            () => {
                // destroy
                update_fn_map.delete(index);
                if (update_fn_map.size === 0) {
                    move_com.destroy();
                }
            },
            () => {
                // start
                update_fn_map.get(index).isStop = false;
                const hasStopItem = [...update_fn_map.values()].find(
                    (item) => item.isStop === true,
                );

                if (!hasStopItem) {
                    move_com.start();
                }
            },
            () => {
                // stop
                update_fn_map.get(index).isStop = true;
                const hasMoveItem = [...update_fn_map.values()].find(
                    (item) => item.isStop === false,
                );
                if (!hasMoveItem) {
                    move_com.stop();
                }
            },
        ];
    };

    move_com.onUpdate((move_info) => {
        for (const [, fn_item] of update_fn_map) {
            const { update_fn } = fn_item;
            update_fn(move_info);
        }
    });
    for (let i = 0; i < group.length; i++) {
        const { type, pos } = sprite_group[i];
        const { eid: id } = group[i];
        const [onUpdate, destroy, start, stop] = createUpdateFn(
            (move_info: MoveInfo) => {
                const { pos: _pos, ...other } = move_info;
                const _move_info = {
                    ...other,
                } as MoveInfo;
                if (_pos) {
                    _move_info.pos = {
                        x: _pos.x + pos.x,
                        y: _pos.y + pos.y,
                    };
                }
                return _move_info;
            },
            i,
        );
        const _move_com = {
            start,
            stop,
            onUpdate,
            destroy,
        } as MoveCom;
        const fish_data: FishData = {
            id,
            type,
            score,
            currency: currencyFish,
        };
        const fish = new FishModel(fish_data, game);
        fish.setMoveCom(_move_com);
        if (isBombFish(fish)) {
            fish.addCom(new FishBombCom(fish));
        }
        result.push(fish);
    }
    return result;
}

/** 获取被炸弹炸到的鱼 */
export function getBeBombFishIds(pos: Point): string[] {
    return getBeBombFish(pos).map((item) => {
        return item.id;
    });
}
export function getBeBombFish(pos: Point): FishModel[] {
    const body = createBombBody();
    body.update(pos);
    const fish_list = getCollisionAllFish(body);
    body.destroy();
    return fish_list;
}

/** 创建炸弹的body */
export function createBombBody() {
    const circle = new SAT.Circle(new SAT.Vector(0, 0), Config.BombRadius);
    const shape = {
        shape: circle,
        pos: new SAT.Vector(0, 0),
    };
    return new BodyCom([shape], false);
}

/** 用户捕捉到鱼 */
export async function playerCaptureFish(
    player: PlayerModel,
    fish: FishModel,
    info: Partial<HitRep>,
) {
    if (isBombFish(fish)) {
        const fish_bomb_com = fish.getCom(FishBombCom);
        fish_bomb_com.active(player);
    }
    const pos = await fish.beCapture();
    const { drop, win, winScore } = info;
    if (!pos) {
        error(`cant find fish pos`);
    }
    player.captureFish(pos, { win, winScore, drop } as CaptureGain);
}

export function waitFishDestroy(fish: FishModel) {
    const { event } = fish;
    return new Promise((resolve, reject) => {
        if (fish.destroyed) {
            return setTimeout(resolve);
        }
        event.once(
            FishEvent.Destroy,
            () => {
                setTimeout(resolve);
            },
            this,
        );
    });
}
