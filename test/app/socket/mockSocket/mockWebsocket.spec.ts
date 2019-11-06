import {
    connectSocket,
    getSocket,
    mockSocketCtor,
} from 'ctrl/net/webSocketWrapUtil';
import { range } from 'lodash';
import { ServerEvent } from 'data/serverEvent';
import { Test } from 'testBuilder';
import { test_data } from '../../../testData';
import { MockWebSocket } from './mockWebSocket';
import { sleep } from 'utils/animate';
import { player_test } from '../../game/player.spec';
import { game_test } from '../../game/game.spec';
import { modelState } from 'model/modelState';
import { createLineDisplaceFun } from '../../displace/displaceFun.spec';

export const mock_web_socket_test = new Test('mock_web_socket', runner => {
    runner.describe('create', () => {
        mockSocketCtor(MockWebSocket);
        connectSocket({
            url: '',
            publicKey: '',
            code: '',
            name: 'game',
        });
    });

    runner.describe(ServerEvent.Hit, () => {
        mock_web_socket_test.runTest('create');
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        sendEvent.on(ServerEvent.Hit, (data: HitReq) => {
            sleep(1).then(() => {
                event.emit(ServerEvent.Hit, {
                    userId: test_data.userId,
                    eid: data.eid,
                    win: 10000,
                } as HitRep);
            });
        });
    });

    runner.describe(ServerEvent.UseBomb, () => {
        mock_web_socket_test.runTest('create');
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        sendEvent.on(ServerEvent.UseBomb, (data: UseBombReq) => {
            sleep(0.1).then(() => {
                const { bombPoint, eid } = data;
                const fish_arr = [] as UseBombRep['killedFish'];
                for (const eid_item of eid) {
                    fish_arr.push({
                        eid: eid_item,
                        win: 1000,
                    });
                }

                event.emit(ServerEvent.UseBomb, {
                    userId: test_data.userId,
                    bombPoint,
                    count: 1000,
                    killedFish: fish_arr,
                } as UseBombRep);
            });
        });
    });

    runner.describe('other_bomb', async () => {
        mock_web_socket_test.runTest('create');
        await game_test.runTest('enter_game');
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        player_test.runTest('add_other_player');

        sendEvent.on(ServerEvent.UseBomb, (data: UseBombReq) => {
            sleep(0.1).then(() => {
                const { bombPoint, eid } = data;
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

    mock_web_socket_test.runTest('create');
    runner.describe('shoal', async () => {
        await game_test.runTest('enter_game');
        const { event } = getSocket('game') as MockWebSocket;

        event.emit(ServerEvent.FishShoalWarn, {
            shoalId: '1',
            delay: 5,
        } as FishShoalWarnRep);

        await sleep(5);
        const fish_arr = [] as ServerFishInfo[];
        for (const i of range(1, 21)) {
            const fish = createLineDisplaceFun(
                `${i}`,
                50,
                50 * (i * 0.05),
                i * (750 / 40) + 40,
            );
            fish_arr.push(fish);
        }

        event.emit(ServerEvent.FishShoal, {
            shoalId: '1',
            fish: fish_arr,
        } as FishShoal);
    });
});
