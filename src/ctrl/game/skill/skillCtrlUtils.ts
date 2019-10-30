import { SkillModel } from 'model/game/skill/skillModel';
import { onPoolClick, onFishClick, offFishClick } from 'view/viewState';
import { FreezeModel } from 'model/game/skill/freezeModel';
import { BombModel } from 'model/game/skill/bombModel';
import { TrackFishModel } from 'model/game/skill/trackFishModel';

/** 技能的激活前的处理 */
export function skillPreActiveHandler(model: SkillModel) {
    return new Promise((resolve, reject) => {
        if (model instanceof FreezeModel) {
            model.active({
                fish_list: [],
                used_time: 0,
            });
            resolve();
        } else if (model instanceof BombModel) {
            console.log('1. 请选择屏幕中选择爆炸位置..');
            onPoolClick().then((pos: Point) => {
                const fish_list = model.getBombFish(pos);

                model.active({
                    fish_list,
                    used_time: 0,
                });
                // 计算爆炸区域的鱼, 发送给服务端...
                // 收到服务端的信息需要统一的处理...
                // onGameCtrl...
            });
        } else if (model instanceof TrackFishModel) {
            // 发送命令给服务器, 接受到信息之后, 选鱼提示
            console.log('2. 请选择屏幕中的鱼..');
            onFishClick().subscribe((fish_id: string) => {
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

/** 技能的激活的处理 */
export function skillActiveHandler(model: SkillModel) {
    return new Promise((resolve, reject) => {
        if (model instanceof TrackFishModel) {
            console.log('2. 请选择屏幕中的鱼..');
            onFishClick().subscribe((fish_id: string) => {
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
        if (model instanceof TrackFishModel) {
            console.log('取消选中屏幕的鱼...');
            offFishClick();
        } else {
            resolve();
        }
    });
}
