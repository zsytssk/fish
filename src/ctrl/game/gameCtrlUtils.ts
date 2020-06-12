import { modelState } from 'model/modelState';
import { ctrlState } from 'ctrl/ctrlState';
import { SkillMap } from 'data/config';
import { LockFishModel } from 'model/game/skill/lockFishModel';

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

/** 禁用当前用户的自动操作行为:> 自动开炮 锁定 */
export function disableCurUserOperation() {
    const cur_player = modelState.app.game.getCurPlayer();
    if (!cur_player) {
        return;
    }
    cur_player.disableSkill(SkillMap.Auto);
    const lock_skill = cur_player.getSkill(SkillMap.LockFish) as LockFishModel;
    lock_skill.unLock();
}

/** 禁用当前用户的自动操作行为:> 自动开炮 锁定 */
export function disableAllUserOperation() {
    const players = modelState.app.game.getPlayers();
    for (const player of players) {
        player.disableSkill(SkillMap.Auto);
        const lock_skill = player.getSkill(SkillMap.LockFish) as LockFishModel;
        lock_skill.unLock();
    }
}
