import { GameTestCtrl } from './gameTestCtrl';
import { modelState } from 'model/modelState';
import {
    mockSocketCtor,
    createSocket,
    getSocket,
    disconnectSocket,
} from 'ctrl/net/webSocketWrapUtil';
import { MockWebSocket } from 'ctrl/net/mockWebSocket';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { sleep } from 'utils/animate';
import { SkillMap } from 'data/config';
import { PlayerInfo } from 'model/game/playerModel';

export function genFishInfo(game_ctrl: GameTestCtrl) {
    const typeId = 1;
    const pathId = 3;
    const totalTime = 1200 * 1000;
    const usedTime = 600 * 1000;
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
            [SkillMap.TrackFish]: {
                item_id: SkillMap.TrackFish,
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
    model.addPlayer(player_data);
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
            event.emit(ServerEvent.Shoot, {
                userId: user_id,
                direction: data.direction,
            } as ShootRep);
        });
    });

    sendEvent.on(ServerEvent.Hit, (data: HitReq) => {
        sleep(1).then(() => {
            event.emit(ServerEvent.Hit, {
                userId: user_id,
                eid: data.eid,
                win: 1,
            } as HitRep);
        });
    });

    return socket;
}

export async function mockShoot() {
    const user_id = modelState.app.user_info.user_id;
    const { event } = getSocket(ServerName.Game) as MockWebSocket;

    event.emit(ServerEvent.Shoot, {
        userId: user_id,
        direction: { x: 1.3, y: -1 },
    } as ShootRep);

    return sleep(1);
}

export function resetMockSocketCtor(game_ctrl: GameTestCtrl) {
    const { model } = game_ctrl;
    disconnectSocket(ServerName.Game);
    mockSocketCtor(undefined);
    model.destroy();
}
