import { AppModel } from './appModel';
import { BodyCom } from './com/bodyCom';
import { detectCollision } from './com/bodyComUtil';
import { FishModel } from './fishModel';

type ModelState = {
    app: AppModel;
};
export let modelState = {} as ModelState;

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
