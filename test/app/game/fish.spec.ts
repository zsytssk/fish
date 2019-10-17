import { range } from 'lodash';
import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { FishModel } from 'model/fishModel';
/** @type {FishModel} 的测试 */
export const fish_test = new Test('fish', runner => {
    runner.describe(
        'add_fish',
        (typeId: number, pathId: number, time: number) => {
            // body_test.runTest('show_shape');
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
            for (const i of range(1, 21)) {
                typeId = typeId || 1;
                pathId = i;
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
        // body_test.runTest('show_shape');
        for (const i of range(1, 21)) {
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
