import { SkillModel } from 'model/skill/skillModel';
import { onPoolClick, onFishClick } from 'view/viewState';
import { FreezingModel } from 'model/skill/freezingModel';
import { BombModel } from 'model/skill/bombModel';
import { TrackFishModel } from 'model/skill/trackFishModel';

/** 技能的激活的处理 */
export function skillActiveHandler(model: SkillModel) {
    return new Promise((resolve, reject) => {
        const id = model.skill_core.item_id;
        if (model instanceof FreezingModel) {
            resolve();
        } else if (model instanceof BombModel) {
            console.log('1. 请选择屏幕中选择爆炸位置..');
            onPoolClick().then((pos: Point) => {
                console.log(`2: 爆炸位置:>`, pos);
                const fish_list = model.getBombFish(pos);
                console.log(fish_list);

                // 计算爆炸区域的鱼, 发送给服务端...
                // 收到服务端的信息需要统一的处理...
                // onGameCtrl...
            });
        } else if (model instanceof TrackFishModel) {
            console.log('2. 请选择屏幕中的鱼..');
            onFishClick().then((fish_id: string) => {
                console.log(`点击的鱼:>`, fish_id);
                model.active({
                    fish: fish_id,
                    pre_active: true,
                    used_time: 0,
                });
                // 将鱼的id发给服务器...
                // 收到服务端的信息需要统一的处理...
                // onGameCtrl...
            });
        } else {
            resolve();
        }
    });
}
/** 技能的disabled处理 */
export function skillDisableHandler(model: SkillModel) {
    return new Promise((resolve, reject) => {
        const id = model.skill_core.item_id;
        if (model instanceof TrackFishModel) {
            console.log('取消选中屏幕的鱼...');
            // offFishClick()
        } else {
            resolve();
        }
    });
}
