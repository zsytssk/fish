import { state } from 'ctrl/state';
import { Test } from 'testBuilder';
import { body_test } from './body.spec';

export const fish_test = new Test('fish', runner => {
    runner.describe('add_fish', (i: number, j: number, t: number) => {
        body_test.runTest('show_shape');

        i = i || 1;
        j = j || 1;
        t = t || 15;
        const fish_data = {
            fishId: '00' + i,
            typeId: `${i + 1}`,
            displaceType: 'path',
            pathNo: `${j}`,
            totalTime: t,
            usedTime: 0,
        } as ServerFishInfo;
        state.game_model.addFish(fish_data);
    });
});
