import {
    createSocket,
    getSocket,
    mockSocketCtor,
} from 'ctrl/net/webSocketWrapUtil';
import { range } from 'lodash';
import { ServerEvent } from 'data/serverEvent';
import { Test } from 'testBuilder';
import { test_data } from '../../../testData';
import { sleep } from 'utils/animate';
import { player_test } from '../../game/player.spec';
import { game_test } from '../../game/game.spec';
import { modelState } from 'model/modelState';
import { createLineDisplaceFun } from '../../displace/displaceFun.spec';
import { SkillMap } from 'data/config';
import { MockWebSocket } from 'ctrl/net/mockWebSocket';

export const mock_web_socket_test = new Test('mock_web_socket', runner => {
    runner.describe('create', async () => {
        mockSocketCtor(MockWebSocket);
        await createSocket({
            url: '',
            publicKey: '',
            code: '',
            name: 'game',
            host: '',
        });
        await createSocket({
            url: '',
            publicKey: '',
            code: '',
            name: 'hall',
            host: '',
        });
    });

    runner.describe(ServerEvent.Hit, () => {
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        sendEvent.on(ServerEvent.Hit, (data: HitReq) => {
            sleep(1).then(() => {
                event.emit(ServerEvent.Hit, {
                    userId: test_data.userId,
                    eid: data.eid,
                    win: 0,
                    drop: [
                        { itemId: SkillMap.Bomb, itemNum: 10 },
                        { itemId: SkillMap.TrackFish, itemNum: 10 },
                    ],
                } as HitRep);
            });
        });
    });

    runner.describe(ServerEvent.Shoot, async () => {
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        sendEvent.on(ServerEvent.Shoot, (data: ShootReq) => {
            sleep(0.01).then(() => {
                event.emit(ServerEvent.Shoot, {
                    userId: test_data.userId,
                    direction: data.direction,
                } as ShootRep);
            });
        });
    });

    runner.describe(ServerEvent.UseBomb, () => {
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        sendEvent.on(ServerEvent.UseBomb, (data: UseBombReq) => {
            sleep(0.1).then(() => {
                const { bombPoint, fishList: eid } = data;
                const fish_arr = [] as UseBombRep['killedFish'];
                for (const eid_item of eid) {
                    fish_arr.push({
                        eid: eid_item,
                        win: 1000,
                    });
                }

                event.emit(
                    ServerEvent.UseBomb,
                    {
                        userId: test_data.userId,
                        bombPoint,
                        count: 1000,
                        killedFish: fish_arr,
                    } as UseBombRep,
                    200,
                );
            });
        });
    });

    runner.describe(ServerEvent.FishBomb, () => {
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        sendEvent.on(ServerEvent.FishBomb, (data: UseBombReq) => {
            sleep(0.1).then(() => {
                const { bombPoint, fishList: eid } = data;
                const fish_arr = [] as UseBombRep['killedFish'];
                for (const eid_item of eid) {
                    fish_arr.push({
                        eid: eid_item,
                        win: 1000,
                    });
                }

                event.emit(ServerEvent.FishBomb, {
                    userId: test_data.userId,
                    bombPoint,
                    count: 1000,
                    killedFish: fish_arr,
                } as UseBombRep);
            });
        });
    });

    runner.describe('other' + ServerEvent.UseBomb, async () => {
        mock_web_socket_test.runTest('create');
        await game_test.runTest('enter_game');
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        player_test.runTest('add_other_player');

        sendEvent.on(ServerEvent.UseBomb, (data: UseBombReq) => {
            sleep(0.1).then(() => {
                const { bombPoint, fishList: eid } = data;
                const fish_arr = [] as UseBombRep['killedFish'];
                for (const eid_item of eid) {
                    fish_arr.push({
                        eid: eid_item,
                        win: 1000,
                    });
                }

                event.emit(ServerEvent.UseBomb, {
                    userId: test_data.otherUserId,
                    bombPoint,
                    count: 1000,
                    killedFish: fish_arr,
                } as UseBombRep);
            });
        });
    });

    runner.describe('freeze', async () => {
        mock_web_socket_test.runTest('create');
        await game_test.runTest('enter_game');
        const { sendEvent, event } = getSocket('game') as MockWebSocket;

        sendEvent.on(ServerEvent.UseFreeze, () => {
            sleep(0.1).then(() => {
                const fish_model_arr = modelState.app.game.getAllFish();
                const fish_arr = fish_model_arr.map(item => {
                    return item.id;
                });

                event.emit(ServerEvent.UseFreeze, {
                    userId: test_data.userId,
                    duration: 0,
                    count: 1000,
                    frozenFishList: fish_arr,
                } as UseFreezeRep);
            });
        });
    });

    runner.describe('lock_fish', async () => {
        mock_web_socket_test.runTest('create');
        await game_test.runTest('enter_game');
        const { sendEvent, event } = getSocket('game') as MockWebSocket;

        sendEvent.on(ServerEvent.UseLock, () => {
            sleep(0.1).then(() => {
                const fish_model_arr = modelState.app.game.getAllFish();
                const fish_arr = fish_model_arr.map(item => {
                    return item.id;
                });

                event.emit(ServerEvent.UseLock, {
                    userId: test_data.userId,
                    duration: 0,
                    count: 1000,
                    lockedFish: fish_arr[0],
                } as UseLockRep);
            });
        });
        sendEvent.on(ServerEvent.LockFish, (data: LockFishReq) => {
            sleep(0.1).then(() => {
                const { eid } = data;
                event.emit(ServerEvent.LockFish, {
                    userId: test_data.userId,
                    eid,
                } as LockFishRep);
            });
        });
    });

    runner.describe(ServerEvent.FishShoal, async (data: ServerFishInfo[]) => {
        const { event } = getSocket('game') as MockWebSocket;

        event.emit(ServerEvent.FishShoalWarn, {
            shoalId: '1',
            delay: 5,
        } as FishShoalWarnRep);

        await sleep(2);

        event.emit(ServerEvent.FishShoal, {
            shoalId: '1',
            fish: data,
        } as FishShoal);
    });

    runner.describe('add_fish', async () => {
        mock_web_socket_test.runTest('create');
        await game_test.runTest('enter_game');
        await sleep(3);
        const { event } = getSocket('game') as MockWebSocket;

        const fish_arr = [] as ServerFishInfo[];
        for (const i of range(1, 21)) {
            const fish = createLineDisplaceFun(`${i}`, 30, -(i * 4), 750 / 2);
            fish_arr.push(fish);
        }

        event.emit(ServerEvent.AddFish, {
            fish: fish_arr,
        } as ServerAddFishRep);
    });
});
