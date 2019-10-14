import { range } from 'lodash';
import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { body_test } from './body.spec';

export const fish_test = new Test('fish', runner => {
    runner.describe(
        'add_fish',
        (typeId: number, pathId: number, time: number) => {
            body_test.runTest('show_shape');
            typeId = typeId || 17;
            pathId = pathId || 17;
            time = time || 15;
            const fish_data = {
                fishId: '00' + typeId,
                typeId: `${typeId}`,
                displaceType: 'path',
                pathNo: `${pathId}`,
                totalTime: time,
                usedTime: 0,
            } as ServerFishInfo;
            modelState.app.game.addFish(fish_data);
        },
    );

    runner.describe(
        'fish_path',
        (typeId: number, pathId: number, time: number) => {
            const start = 14;
            const end = 26;
            for (let _j = start; _j <= end; _j++) {
                typeId = typeId || 1;
                pathId = _j;
                time = time || 15;
                const fish_data = {
                    fishId: '00' + typeId,
                    typeId: `${typeId}`,
                    displaceType: 'path',
                    pathNo: `${pathId}`,
                    totalTime: time,
                    usedTime: 0,
                } as ServerFishInfo;
                modelState.app.game.addFish(fish_data);
            }
        },
    );

    runner.describe('fish_ani', () => {
        body_test.runTest('show_shape');
        const n = 2;
        for (const i of range(n, n + 1)) {
            const typeId = i;
            const pathId = i;
            const time = 40;
            const fish_data = {
                fishId: '00' + typeId,
                typeId: `${typeId}`,
                displaceType: 'path',
                pathNo: `${pathId}`,
                totalTime: time,
                usedTime: 0,
            } as ServerFishInfo;
            modelState.app.game.addFish(fish_data);
        }
    });
});
