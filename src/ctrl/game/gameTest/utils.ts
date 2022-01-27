import { MockWebSocket } from '@app/ctrl/net/mockWebSocket';
import {
    mockSocketCtor,
    createSocket,
    getSocket,
    disconnectSocket,
} from '@app/ctrl/net/webSocketWrapUtil';
import { SkillMap } from '@app/data/config';
import { ServerEvent, ServerName } from '@app/data/serverEvent';
import { PlayerInfo } from '@app/model/game/playerModel';
import { modelState } from '@app/model/modelState';
import { sleep } from '@app/utils/animate';

import { GameTestCtrl } from './gameTestCtrl';

export function genFishInfo(game_ctrl: GameTestCtrl) {
    const typeId = 1;
    const pathId = 3;
    const totalTime = 1200000 * 1000;
    const usedTime = totalTime / 2;
    const fish_data = {
        eid: '00' + typeId,
        fishId: `${typeId}`,
        displaceType: 'path',
        pathNo: `${pathId}`,
        totalTime,
        usedTime,
    } as ServerFishInfo;
    game_ctrl.model.addFish(fish_data);
}

export function genUserInfo(game_ctrl: GameTestCtrl) {
    const { model } = game_ctrl;
    const user_id = modelState.app.user_info.user_id;
    const player_data = {
        user_id,
        server_index: 0,
        bullet_cost: 1,
        bullet_num: 1,
        gun_skin: '1',
        nickname: user_id,
        avatar: 'test',
        need_emit: true,
        is_cur_player: true,
        skills: {
            [SkillMap.Freezing]: {
                item_id: SkillMap.Freezing,
                num: 1,
                cool_time: 10,
                used_time: 0,
            },
            [SkillMap.LockFish]: {
                item_id: SkillMap.LockFish,
                num: 20,
                cool_time: 10,
                used_time: 0,
            },
            [SkillMap.Bomb]: {
                item_id: SkillMap.Bomb,
                num: 20,
                cool_time: 10,
                used_time: 0,
            },
        },
    } as PlayerInfo;
    model.addPlayer(player_data, game_ctrl.needUpSideDown);
}

export async function mockSocket() {
    const user_id = modelState.app.user_info.user_id;
    mockSocketCtor(MockWebSocket);
    const socket = await createSocket({
        url: '',
        publicKey: '',
        code: '',
        name: 'game',
        host: '',
    });
    const { sendEvent, event } = socket as MockWebSocket;

    sendEvent.on(ServerEvent.Shoot, (data: ShootReq) => {
        sleep(0.01).then(() => {
            event.emit(
                ServerEvent.Shoot,
                {
                    userId: user_id,
                    direction: data.direction,
                } as ShootRep,
                200,
            );
        });
    });

    sendEvent.on(ServerEvent.Hit, (data: HitReq) => {
        sleep(0.1).then(() => {
            event.emit(
                ServerEvent.Hit,
                {
                    userId: user_id,
                    eid: data.eid,
                    win: 2,
                } as HitRep,
                200,
            );
        });
    });

    return socket;
}

export async function mockShoot() {
    const user_id = modelState.app.user_info.user_id;
    const { event } = getSocket(ServerName.Game) as MockWebSocket;

    event.emit(
        ServerEvent.Shoot,
        {
            userId: user_id,
            direction: { x: 1.3, y: -1 },
        } as ShootRep,
        200,
    );

    return sleep(2);
}

export function resetMockSocketCtor(game_ctrl: GameTestCtrl) {
    if (!game_ctrl) {
        return;
    }
    const { model } = game_ctrl;
    disconnectSocket(ServerName.Game);
    mockSocketCtor(undefined);
    model.destroy();
}
