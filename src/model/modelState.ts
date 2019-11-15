import { AppModel } from './appModel';
import { BodyCom } from './game/com/bodyCom';
import { detectCollision } from './game/com/bodyComUtil';
import { FishModel } from './game/fish/fishModel';

type ModelState = {
    app: AppModel;
};
export let modelState = {} as ModelState;

/** 获取鱼 */
export function getUserInfo() {
    return modelState.app.user_info;
}
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
        const { body, visible } = fish;

        /** 鱼还没有显示 不需要做碰撞检测... */
        if (!visible) {
            continue;
        }

        if (detectCollision(ori_body, body)) {
            contain_list.push(fish);
        }
    }
    return contain_list;
}
