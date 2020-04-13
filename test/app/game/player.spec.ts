import { SkillMap } from 'data/config';
import { PlayerInfo } from 'model/game/playerModel';
import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { test_data } from '../../testData';

/** @type {PlayerModel} 的测试 */
export const player_test = new Test('player', runner => {
    runner.describe('add_cur_player', () => {
        const player = modelState.app.game.getPlayerById(test_data.userId);
        if (player) {
            return;
        }
        // body_test.runTest('show_shape');
        const player_data = {
            user_id: test_data.userId,
            server_index: 1,
            bullet_cost: 10,
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
        modelState.app.game.addPlayer(player_data);
    });

    let i = 0;
    runner.describe('add_other_player', (seat_index: number) => {
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
                gun_skin: '4',
                nickname: test_data.otherNickname,
                avatar: 'test',
                is_cur_player: false,
                need_emit: false,
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
        }
    });
});
