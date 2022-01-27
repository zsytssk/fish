import { testBuild } from 'testBuilder';

import { ctrlState } from '@app/ctrl/ctrlState';
import { SkillMap } from '@app/data/config';
import { ServerEvent } from '@app/data/serverEvent';
import { FishModel } from '@app/model/game/fish/fishModel';
import { GunEvent } from '@app/model/game/gun/gunModel';
import { PlayerInfo } from '@app/model/game/playerModel';
import { modelState } from '@app/model/modelState';

import { test_data } from '../../testData';

/** @type {PlayerModel} 的测试 */
export const player_test = testBuild({
    add_cur_player: (server_index = 1) => {
        const player = modelState.game.getPlayerById(test_data.userId);
        if (player) {
            player.destroy();
        }
        // body_test.runTest('show_shape');
        const player_data = {
            user_id: test_data.userId,
            server_index: 1,
            bullet_cost: 1,
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
        console.log(`test:>2`, modelState.game);
        ctrlState.game.addPlayers([player_data]);
    },

    add_other_player: async (seat_index: number) => {
        let i = 0;
        const other_id = test_data.otherUserId + i;
        i++;

        const other_player = modelState.game.getPlayerById(other_id);
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
            ctrlState.game.addPlayers([player_data]);

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
    },

    list_player_id: () => {
        const player_list = modelState.game['player_list'];
        for (const player of player_list) {
            console.log(
                `${player.server_index}:>${player.user_id}${
                    player.is_cur_player ? ':>(self)' : ''
                }`,
            );
        }
    },

    repeat_hit: () => {
        const cur_player = modelState.game.getCurPlayer();
        const game_ctrl = ctrlState.game;
        cur_player.gun.event.on(
            GunEvent.CastFish,
            (data: { fish: FishModel; level: number }) => {
                const {
                    fish: { id: eid },
                    level: multiple,
                } = data;
                game_ctrl.sendToGameSocket(ServerEvent.Hit, {
                    eid,
                    multiple,
                } as HitReq);

                game_ctrl.sendToGameSocket(ServerEvent.Hit, {
                    eid,
                    multiple,
                } as HitReq);
            },
        );
    },
});
