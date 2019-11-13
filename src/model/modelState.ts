import { FishSpriteInfo } from 'data/sprite';
import { getSpriteInfo } from 'utils/dataUtil';
import { createFishDisplace } from 'utils/displace/displaceUtil';
import { AppModel } from './appModel';
import { BodyCom } from './game/com/bodyCom';
import { detectCollision } from './game/com/bodyComUtil';
import { MoveDisplaceCom } from './game/com/moveCom/moveDisplaceCom';
import { FishModel } from './game/fishModel';
import { GameModel } from './game/gameModel';
import { PlayerModel } from './game/playerModel';

type ModelState = {
    app: AppModel;
};
export let modelState = {} as ModelState;

/** 获取鱼 */
export function isCurUser(id: string) {
    return id === modelState.app.user_info.user_id;
}
/** 获取鱼 */
export function getFishById(id: string) {
    const { game } = modelState.app;
    return game.getFishById(id);
}
/** 检测碰撞到鱼: 获取第一个 */
export function getCollisionFish(ori_body: BodyCom) {
    const { fish_list } = modelState.app.game;
    for (const fish of fish_list) {
        const { body } = fish;
        if (detectCollision(ori_body, body)) {
            return fish;
        }
    }
}
/** 检测碰撞到鱼:所有的 */
export function getCollisionAllFish(
    ori_body: BodyCom,
    contain_list: FishModel[] = [],
) {
    const { fish_list } = modelState.app.game;
    for (const fish of fish_list) {
        if (contain_list.indexOf(fish) !== -1) {
            continue;
        }
        const { body } = fish;

        if (detectCollision(ori_body, body)) {
            contain_list.push(fish);
        }
    }
    return contain_list;
}

/** 创建鱼 move_com在外面创建 */
export function createFish(data: ServerFishInfo, game: GameModel): FishModel {
    const { eid: id, fishId: type } = data;
    const displace = createFishDisplace(data);
    const move_com = new MoveDisplaceCom(displace);
    const fish = new FishModel(
        {
            id,
            type,
            move_com,
        },
        game,
    );
    return fish;
}

export type MoveUpdateComposeFn = (move_info: MoveInfo) => MoveInfo;
type FishGroupItemUpdate = {
    id: number;
    update_fn: MoveUpdateFn;
};
/** 创建鱼组 */
export function createFishGroup(
    data: ServerFishInfo,
    game: GameModel,
): FishModel[] {
    const { fishId: groupType, group } = data;
    const result = [] as FishModel[];
    const { group: sprite_group } = getSpriteInfo(
        'fish',
        groupType,
    ) as FishSpriteInfo;
    if (!sprite_group) {
        return result;
    }
    const displace = createFishDisplace(data);
    const move_com = new MoveDisplaceCom(displace);

    /**  onUpdate + destroy 需要提前处理,
     * onUpdate 在原来的update基础上需要加上相对的 pos
     * destroy 只有所有的鱼个都 destroy 就把原来的 move_com destroy
     */
    const update_fn_list: Set<FishGroupItemUpdate> = new Set();
    const createUpdateFn = (fn: MoveUpdateComposeFn, index: number) => {
        return [
            (sub_fn: MoveUpdateFn) => {
                // onUpdate
                update_fn_list.add({
                    update_fn: (move_info: MoveInfo) => {
                        const _move_info = fn(move_info);
                        sub_fn(_move_info);
                    },
                    id: index,
                });
            },
            () => {
                // destroy
                for (const item of update_fn_list) {
                    if (item.id === index) {
                        update_fn_list.delete(item);
                        if (update_fn_list.size === 0) {
                            move_com.destroy();
                        }
                    }
                }
            },
            () => {
                // start
                move_com.start();
            },
            () => {
                // stop
                move_com.stop();
            },
        ];
    };

    move_com.onUpdate(move_info => {
        for (const fn_item of update_fn_list) {
            const { update_fn } = fn_item;
            update_fn(move_info);
        }
    });
    for (let i = 0; i < sprite_group.length; i++) {
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
        const fish = new FishModel(
            {
                id,
                type,
                move_com: _move_com,
            },
            game,
        );
        result.push(fish);
    }
    return result;
}

/** 用户捕捉到鱼 */
export function playerCaptureFish(
    player: PlayerModel,
    fish: FishModel,
    win: number,
) {}
