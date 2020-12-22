import { SkillMap } from 'data/config';
import { PlayerInfo } from 'model/game/playerModel';
import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { test_data } from '../../testData';
import { GunEvent } from 'model/game/gun/gunModel';
import { FishModel } from 'model/game/fish/fishModel';
import { sendToGameSocket } from 'ctrl/game/gameSocket';
import { ServerEvent } from 'data/serverEvent';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { MockWebSocket } from 'ctrl/net/mockWebSocket';
import { sleep } from '../../utils/testUtils';

/** @type {PlayerModel} 的测试 */
export const player_test = new Test('player', runner => {
    runner.describe('add_cur_player', (server_index = 1) => {
        const player = modelState.app.game.getPlayerById(test_data.userId);
        if (player) {
            player.destroy();
        }
        // body_test.runTest('show_shape');
        const player_data = {
            user_id: test_data.userId,
            server_index: 2,
            bullet_cost: 20,
            bullet_num: 100000000,
            gun_skin: '1',
            nickname: test_data.nickname,
            avatar: 'test',
            need_emit: true,
            is_cur_player: true,
            skills: {
                [SkillMap.Freezing]: {
                    item_id: SkillMap.Freezing,
                    num: 20,
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
                    cool_time: 3,
                    used_time: 0,
                },
            },
        } as PlayerInfo;
        modelState.app.game.addPlayer(player_data);
    });

    let i = 0;
    runner.describe('add_other_player', async (seat_index: number) => {
        const other_id = test_data.otherUserId + i;
        i++;

        let other_player = modelState.app.game.getPlayerById(other_id);
        if (!other_player) {
            seat_index = isNaN(Number(seat_index)) ? 3 : seat_index;

            const player_data = {
                user_id: other_id,
                server_index: seat_index,
                bullet_cost: Math.pow(10, i),
                bullet_num: 10000,
                gun_skin: `${i + 1}`,
                nickname: test_data.otherNickname,
                avatar: 'test',
                is_cur_player: false,
                need_emit: true,
                skills: {
                    '1': {
                        item_id: '1',
                        num: 20,
                        cool_time: 10,
                        used_time: 0,
                    },
                    '2': {
                        item_id: '1',
                        num: 20,
                        cool_time: 10,
                        used_time: 0,
                    },
                    '3': {
                        item_id: '1',
                        num: 20,
                        cool_time: 10,
                        used_time: 0,
                    },
                },
            } as PlayerInfo;
            other_player = modelState.app.game.addPlayer(player_data);

            // await sleep(2);
            // const { event } = getSocket('game') as MockWebSocket;
            // event.emit(
            //     ServerEvent.autoShoot,
            //     {
            //         userId: other_id,
            //         autoShoot: true,
            //     } as AutoShootRep,
            //     200,
            // );

            // await sleep(5);
            // event.emit(
            //     ServerEvent.autoShoot,
            //     {
            //         userId: other_id,
            //         autoShoot: false,
            //     } as AutoShootRep,
            //     200,
            // );
        }
    });

    runner.describe('list_player_id', () => {
        const player_list = modelState.app.game['player_list'];
        for (const player of player_list) {
            console.log(
                `${player.server_index}:>${player.user_id}${
                    player.is_cur_player ? ':>(self)' : ''
                }`,
            );
        }
    });

    runner.describe('repeat_hit', () => {
        const cur_player = modelState.app.game.getCurPlayer();
        cur_player.gun.event.on(
            GunEvent.CastFish,
            (data: { fish: FishModel; level: number }) => {
                const {
                    fish: { id: eid },
                    level: multiple,
                } = data;
                sendToGameSocket(ServerEvent.Hit, {
                    eid,
                    multiple,
                } as HitReq);

                sendToGameSocket(ServerEvent.Hit, {
                    eid,
                    multiple,
                } as HitReq);
            },
        );
    });
});
