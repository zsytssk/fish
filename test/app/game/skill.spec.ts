import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { fish_test } from './fish.spec';
import { player_id, player_test } from './player.spec';

export const skill_test = new Test('skill', runner => {
    runner.describe('auto_launch', () => {
        player_test.runTest('add_player');
        const player = modelState.app.game.getPlayerById(player_id);
        player.gun.autoLaunch.active();

        setTimeout(() => {
            player.gun.autoLaunch.clear();
        }, 5000);
    });

    runner.describe('track_fish', () => {
        fish_test.runTest('add_fish');
        player_test.runTest('add_player');
        const player = modelState.app.game.getPlayerById(player_id);
        setTimeout(() => {
            const fish = [...modelState.app.game.fish_list][0];
            player.gun.trackFish.track(fish);
        }, 1000);

        setTimeout(() => {
            player.gun.trackFish.unTrack();
        }, 5000);
    });

    runner.describe('speed_up', () => {
        fish_test.runTest('add_fish');
        player_test.runTest('add_player');
        const player = modelState.app.game.getPlayerById(player_id);
        setTimeout(() => {
            const fish = [...modelState.app.game.fish_list][0];
            player.gun.trackFish.track(fish);

            player.gun.toggleSpeedUp(true);
        }, 1000);

        setTimeout(() => {
            player.gun.toggleSpeedUp(false);
        }, 5000);

        setTimeout(() => {
            player.gun.trackFish.unTrack();
        }, 10000);
    });

    runner.describe('freezing', () => {
        fish_test.runTest('add_fish');

        setTimeout(() => {
            modelState.app.game.freezing_com.freezing(5);
        }, 5000);
    });
});
