import { ctrlState } from '@app/ctrl/ctrlState';
import { getLang } from '@app/ctrl/hall/hallCtrlUtil';
import { waitCreateSocket } from '@app/ctrl/net/webSocketWrapUtil';
import { SkillMap } from '@app/data/config';
import { InternationalTip } from '@app/data/internationalConfig';
import { ServerEvent, ServerName } from '@app/data/serverEvent';
import { LockFishModel } from '@app/model/game/skill/lockFishModel';
import { modelState, getCurPlayer, isCurUser } from '@app/model/modelState';
import { tplStr } from '@app/utils/utils';
import TipPop from '@app/view/pop/tip';

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
    for (const [_, player] of players) {
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

export async function waitGameExchangeOrLeave(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const game_socket = await waitCreateSocket(ServerName.Game);
        game_socket.event.once(
            ServerEvent.ExchangeBullet,
            (data: EnterGameRep, code: number) => {
                game_socket.event.offAllCaller(waitGameExchangeOrLeave);
                if (code !== 200) {
                    return resolve(false);
                }
                resolve(true);
            },
            waitGameExchangeOrLeave,
        );
        game_socket.event.on(
            ServerEvent.RoomOut,
            (data: RoomOutRep) => {
                const { userId } = data;
                if (isCurUser(userId)) {
                    game_socket.event.offAllCaller(waitGameExchangeOrLeave);
                    resolve(true);
                }
            },
            waitGameExchangeOrLeave,
        );
    });
}

type Data = {
    bulletNum?: number;
    bringAmount?: number;
    currency?: string;
};
/** 提示带入 */
export function tipExchange(data: Data) {
    if (!data.currency) {
        return;
    }
    TipPop.tip(
        tplStr('enterGameCostTip', {
            bringAmount: data.bringAmount,
            bulletNum: data.bulletNum,
            currency: data.currency,
        }),
    );
}
