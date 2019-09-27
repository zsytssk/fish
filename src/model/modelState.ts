import { GameModel } from './gameModel';
import { BodyCom } from './com/bodyCom';
import { FishModel } from './fishModel';
import { detectCollision } from './com/bodyComUtil';

type ModelState = {
    game: GameModel;
};
let modelState = {} as ModelState;
export function clearModelState() {
    modelState = {} as ModelState;
}
export function getModelState<K extends keyof ModelState>(
    key: K,
): ModelState[K] {
    return modelState[key];
}
export function setModelState<K extends keyof ModelState>(
    key: K,
    val: ModelState[K],
) {
    modelState[key] = val;
}

/** 检测碰撞到鱼: 获取第一个 */
export function getCollisionFish(ori_body: BodyCom) {
    const { fish_list } = getModelState('game');
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
    const { fish_list } = getModelState('game');
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
