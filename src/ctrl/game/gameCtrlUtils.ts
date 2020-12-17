import { modelState, getCurPlayer } from 'model/modelState';
import { ctrlState } from 'ctrl/ctrlState';
import { SkillMap } from 'data/config';
import { LockFishModel } from 'model/game/skill/lockFishModel';
import { waitCreateSocket } from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { InternationalTip } from 'data/internationalConfig';
import { getLang } from 'ctrl/hall/hallCtrlUtil';
import TipPop from 'view/pop/tip';

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
        if (!player.need_emit) {
            continue;
        }
        player.disableSkill(SkillMap.Auto);
        const lock_skill = player.getSkill(SkillMap.LockFish) as LockFishModel;
        lock_skill.unLock();
    }
}

export async function waitEnterGame(): Promise<[boolean, EnterGameRep?]> {
    return new Promise(async (resolve, reject) => {
        const game_socket = await waitCreateSocket(ServerName.Game);
        game_socket.event.once(
            ServerEvent.EnterGame,
            (data: EnterGameRep, code: number) => {
                if (code !== 200) {
                    return resolve([false]);
                }
                resolve([true, data]);
            },
        );
    });
}

type Data = {
    bulletNum?: number;
    bringAmount?: Number;
    currency?: string;
};
/** 提示带入 */
export function tipExchange(data: Data) {
    if (!data.currency) {
        return;
    }
    const lang = getLang();
    let tip = InternationalTip[lang].enterGameCostTip;
    tip = tip
        .replace(new RegExp('{bringAmount}', 'g'), data.bringAmount + '')
        .replace(new RegExp('{bulletNum}', 'g'), data.bulletNum + '')
        .replace(new RegExp('{currency}', 'g'), data.currency);
    TipPop.tip(tip);
}
