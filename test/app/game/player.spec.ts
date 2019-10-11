import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { PlayerInfo } from 'model/playerModel';
import { body_test } from './body.spec';
import { GunStatus } from 'model/gunModel';
import { fish_test } from './fish.spec';

export const player_test = new Test('player', runner => {
    const player_id = 'xxxx';
    runner.describe('add_player', () => {
        const player = modelState.game.getPlayerById(player_id);
        if (player) {
            return;
        }

        body_test.runTest('show_shape');
        const player_data = {
            userId: player_id,
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

    runner.describe('auto_launch', () => {
        player_test.runTest('add_player');
        const player = modelState.game.getPlayerById(player_id);
        player.gun.autoLaunch.active();

        setTimeout(() => {
            player.gun.autoLaunch.clear();
        }, 5000);
    });

    runner.describe('track_fish', () => {
        fish_test.runTest('add_fish');
        player_test.runTest('add_player');
        const player = modelState.game.getPlayerById(player_id);
        setTimeout(() => {
            const fish = [...modelState.game.fish_list][0];
            player.gun.trackFish.track(fish);
        }, 1000);

        setTimeout(() => {
            player.gun.trackFish.unTrack();
        }, 5000);
    });
});
