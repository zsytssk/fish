import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { PlayerInfo } from 'model/playerModel';
import { body_test } from './body.spec';

export const player_test = new Test('player', runner => {
    runner.describe('add_player', () => {
        body_test.runTest('show_shape');
        const player_data = {
            userId: 'xxxx',
            serverIndex: 1,
            level: 10,
            gold: 10000,
            gunSkin: '2',
            nickname: 'test',
            avatar: 'test',
            isCurPlayer: true,
        } as PlayerInfo;
        modelState.game.addPlayer(player_data);
    });
});
