import { modelState } from 'model/modelState';
import { ctrlState } from 'ctrl/ctrlState';
import { SkillMap } from 'data/config';

export function changeBulletNum(num: number) {
    const userId = modelState.app.user_info.user_id;
    ctrlState.game.changeUserNumInfo({
        userId,
        change_arr: [
            {
                num,
                type: 'bullet',
            },
        ],
    });
}
export function disableAutoShoot() {
    modelState.app.game.getCurPlayer().disableSkill(SkillMap.Auto);
}
