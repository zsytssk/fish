import { range } from 'lodash';

import { MockWebSocket } from '@app/ctrl/net/mockWebSocket';
import {
    createSocket,
    getSocket,
    mockSocketCtor,
} from '@app/ctrl/net/webSocketWrapUtil';
import { SkillMap } from '@app/data/config';
import { ServerEvent } from '@app/data/serverEvent';
import { getAimFish, modelState } from '@app/model/modelState';
import { sleep } from '@app/utils/animate';

import { test_data } from '../../../testData';
import { createLineDisplaceFun } from '../../displace/displaceFun.spec';
import { game_test } from '../../game/game.spec';
import { player_test } from '../../game/player.spec';

export const mock_web_socket_test = {
    create: async () => {
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
    },

    [ServerEvent.Hit]: () => {
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        sendEvent.on(ServerEvent.Hit, (data: HitReq) => {
            sleep(1).then(() => {
                event.emit(
                    ServerEvent.Hit,
                    {
                        userId: test_data.userId,
                        eid: data.eid,
                        win: 100,
                        drop: [
                            { itemId: '2001', itemNum: 10 },
                            { itemId: SkillMap.LockFish, itemNum: 10 },
                            // { itemId: SkillMap.TrackFish, itemNum: 10 },
                        ],
                    } as HitRep,
                    200,
                );
            });
        });
    },

    [ServerEvent.Shoot]: () => {
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        sendEvent.on(ServerEvent.Shoot, (data: ShootReq) => {
            sleep(0.1).then(() => {
                if (data.robotId) {
                    data.userId = data.robotId;
                }
                event.emit(ServerEvent.Shoot, {
                    userId: data.userId,
                    direction: data.direction,
                } as ShootRep);
            });
        });
    },

    [ServerEvent.UseBomb]: () => {
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
                sleep(0.2).then(() => {
                    event.emit(ServerEvent.UseBomb, {}, 100);
                });
            });
        });
    },

    [ServerEvent.FishBomb]: () => {
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

                event.emit(
                    ServerEvent.FishBomb,
                    {
                        userId: test_data.userId,
                        bombPoint,
                        count: 1000,
                        killedFish: [],
                    } as UseBombRep,
                    200,
                );
            });
        });
    },

    ['other' + ServerEvent.UseBomb]: async () => {
        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        player_test.add_cur_player();

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
    },

    [ServerEvent.UseFreeze]: async () => {
        const { sendEvent, event } = getSocket('game') as MockWebSocket;

        sendEvent.on(ServerEvent.UseFreeze, () => {
            sleep(0.1).then(() => {
                const fish_model_arr = modelState.app.game.getAllFish();
                const fish_arr = [...fish_model_arr.values()].map((item) => {
                    return item.id;
                });

                event.emit(
                    ServerEvent.UseFreeze,
                    {
                        userId: test_data.userId,
                        duration: 10000,
                        count: 1000,
                        frozenFishList: fish_arr,
                    } as UseFreezeRep,
                    200,
                );
            });
        });
    },

    [ServerEvent.UseLock]: async () => {
        await game_test.enterGame();
        const { sendEvent, event } = getSocket('game') as MockWebSocket;

        let needActive = true;
        sendEvent.on(ServerEvent.LockFish, (data: LockFishRep) => {
            sleep(0.1).then(() => {
                const { eid } = data;
                event.emit(
                    ServerEvent.LockFish,
                    {
                        needActive,
                        duration: 3000,
                        count: 1000,
                        userId: test_data.userId,
                        eid,
                    } as LockFishRep,
                    200,
                );

                if (needActive) {
                    needActive = false;
                }
            });
        });
    },

    otherLockFish: async () => {
        await game_test.enterGame();
        const other_id = test_data.otherUserId + '0';
        const player = modelState.app.game.getPlayerById(other_id);
        if (!player) {
            player_test.add_cur_player(1);
            await sleep(1);
        }

        const { sendEvent, event } = getSocket('game') as MockWebSocket;
        const fish = getAimFish();
        event.emit(
            ServerEvent.LockFish,
            {
                userId: other_id,
                eid: fish.id,
                needActive: true,
                duration: 3000,
            } as LockFishRep,
            200,
        );
        await sleep(1);

        // event.emit(
        //     ServerEvent.LockFish,
        //     {
        //         userId: other_id,
        //         eid: fish.id,
        //         needActive: true,
        //     } as LockFishRep,
        //     200,
        // );
    },

    otherLockFish2: async () => {
        await await game_test.enterGame();
        const other_id = test_data.otherUserId + '0';

        const { event } = getSocket('game') as MockWebSocket;
        const fish = getAimFish();
        event.emit(
            ServerEvent.LockFish,
            {
                userId: other_id,
                eid: fish.id,
                duration: 3000,
            } as LockFishRep,
            200,
        );
    },

    [ServerEvent.FishShoal]: async (data: ServerFishInfo[]) => {
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
    },

    add_fish: async () => {
        mock_web_socket_test.create();
        await game_test.enterGame();
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
    },
};
