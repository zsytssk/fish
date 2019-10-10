import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { body_test } from './body.spec';

export const fish_test = new Test('fish', runner => {
    runner.describe('add_fish', (i: number, j: number, t: number) => {
        body_test.runTest('show_shape');
        const num = 1;
        for (let _j = 0; _j < num; _j++) {
            i = i || 16;
            j = j || 1;
            t = t || 15;
            const fish_data = {
                fishId: '00' + i,
                typeId: `${i}`,
                displaceType: 'path',
                pathNo: `${j}`,
                totalTime: t,
                usedTime: 0,
            } as ServerFishInfo;
            modelState.game.addFish(fish_data);
        }
    });
});
