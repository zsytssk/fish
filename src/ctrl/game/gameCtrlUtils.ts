import { ctrlState } from '@app/ctrl/ctrlState';
import { waitCreateSocket } from '@app/ctrl/net/webSocketWrapUtil';
import { SkillMap } from '@app/data/config';
import { ServerEvent, ServerName } from '@app/data/serverEvent';
import { LockFishModel } from '@app/model/game/skill/lockFishModel';
import { isCurUser, modelState } from '@app/model/modelState';
import { tplIntr } from '@app/utils/utils';
import TipPop from '@app/view/pop/tip';

import { ChangeUserNumInfo } from './gameCtrl';

export function changeUserAccount(
    userId: string,
    arr: ChangeUserNumInfo['change_arr'],
) {
    ctrlState.game.changeUserNumInfo({
        userId,
        change_arr: arr,
    });
}

export function getItemType(itemId: string) {
    if (itemId === '3001') {
        return 'bullet';
    }
    if (itemId.indexOf('200') === 0) {
        return 'skill';
    }
    return;
}

/** 禁用当前用户的自动操作行为:> 自动开炮 锁定 */
export function disableCurUserOperation() {
    const cur_player = modelState.game.getCurPlayer();
    if (!cur_player) {
        return;
    }
    cur_player.disableSkill(SkillMap.Auto);
    const lock_skill = cur_player.getSkill(SkillMap.LockFish) as LockFishModel;
    lock_skill.unLock();
}

/** 禁用当前用户的自动操作行为:> 自动开炮 锁定 */
export function disableAllUserOperation() {
    const players = modelState.game.getPlayers();
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
        tplIntr('enterGameCostTip', {
            bringAmount: data.bringAmount,
            bulletNum: data.bulletNum,
            currency: data.currency,
        }),
    );
}
