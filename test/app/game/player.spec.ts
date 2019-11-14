import { modelState } from 'model/modelState';
import { PlayerInfo } from 'model/game/playerModel';
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
            server_index: 2,
            bullet_cost: 1,
            bullet_num: 10111,
            gun_skin: '1',
            nickname: test_data.nickname,
            avatar: 'test',
            need_emit: true,
            is_cur_player: true,
            skills: {
                '1': {
                    item_id: '1',
                    num: 20,
                    cool_time: 10,
                    used_time: 0,
                },
                '2': {
                    item_id: '2',
                    num: 20,
                    cool_time: 10,
                    used_time: 0,
                },
                '3': {
                    item_id: '3',
                    num: 20,
                    cool_time: 10,
                    used_time: 0,
                },
                '4': {
                    item_id: '4',
                    num: 20,
                    cool_time: 10,
                    used_time: 0,
                },
            },
        } as PlayerInfo;
        modelState.app.game.addPlayer(player_data);
    });

    runner.describe('add_other_player', () => {
        let other_player = modelState.app.game.getPlayerById(
            test_data.otherUserId,
        );
        if (!other_player) {
            // body_test.runTest('show_shape');
            const player_data = {
                user_id: test_data.otherUserId,
                server_index: 3,
                bullet_cost: 101,
                bullet_num: 10000,
                gun_skin: '1',
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
