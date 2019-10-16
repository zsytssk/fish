import { modelState } from 'model/modelState';
import { PlayerInfo } from 'model/playerModel';
import { Test } from 'testBuilder';
import { body_test } from './body.spec';

export const player_id = 'xxxx';
export const player_test = new Test('player', runner => {
    runner.describe('add_cur_player', () => {
        const player = modelState.app.game.getPlayerById(player_id);
        if (player) {
            return;
        }

        // body_test.runTest('show_shape');
        const player_data = {
            userId: player_id,
            serverIndex: 1,
            level: 10,
            gold: 10000,
            gunSkin: '1',
            nickname: 'test',
            avatar: 'test',
            isCurPlayer: true,
        } as PlayerInfo;
        modelState.app.game.addPlayer(player_data);
    });
    runner.describe('add_other_player', () => {
        const other_id = '----';
        let other_player = modelState.app.game.getPlayerById(other_id);
        if (!other_player) {
            // body_test.runTest('show_shape');
            const player_data = {
                userId: other_id,
                serverIndex: 3,
                level: 10,
                gold: 10000,
                gunSkin: '2',
                nickname: 'test',
                avatar: 'test',
                isCurPlayer: false,
            } as PlayerInfo;
            other_player = modelState.app.game.addPlayer(player_data);
        }
    });
});
