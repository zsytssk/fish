import { range } from 'lodash';
import { FishModel, FishEvent } from 'model/game/fishModel';
import { GameEvent } from 'model/game/gameModel';
import { ModelEvent } from 'model/modelEvent';
import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';

/** @type {FishModel} 的测试 */
export const fish_test = new Test('fish', runner => {
    runner.describe(
        'add_fish',
        (typeId: number, pathId: number, time: number) => {
            // body_test.runTest('show_shape');
            typeId = typeId || 17;
            pathId = pathId || 17;
            time = time || 15;
            const fish_data = genFishInfo(typeId, pathId, time);
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
                const fish_data = genFishInfo(typeId, pathId, time);
                modelState.app.game.addFish(fish_data);
            }
        },
    );

    runner.describe('fish_ani', () => {
        // body_test.runTest('show_shape');
        for (const i of range(1, 21)) {
            const typeId = i;
            const pathId = i;
            const time = 5;
            const fish_data = genFishInfo(typeId, pathId, time);
            modelState.app.game.addFish(fish_data);
        }
    });

    /** 鱼组的测试 */
    runner.describe('add_fish_group', () => {
        // body_test.runTest('show_shape');
        const game = modelState.app.game;
        const typeId = 'G1';
        const pathId = 90;
        const time = 40;
        const fish_data = {
            eid: '00' + typeId,
            fishId: `${typeId}`,
            displaceType: 'path',
            pathNo: `${pathId}`,
            totalTime: time,
            usedTime: 0,
            reverse: true,
            group: [
                {
                    eid: `00g1`,
                    index: 1,
                },
                {
                    eid: `00g2`,
                    index: 2,
                },
                {
                    eid: `00g3`,
                    index: 3,
                },
            ],
        } as ServerFishInfo;
        game.addFish(fish_data);
    });

    /** 鱼组的测试 */
    runner.describe('fish_total_time', () => {
        // body_test.runTest('show_shape');
        const game = modelState.app.game;
        const typeId = 1;
        const pathId = 90;
        const time = 100;
        const fish_data = {
            eid: '00' + typeId,
            fishId: `${typeId}`,
            displaceType: 'path',
            pathNo: `${pathId}`,
            totalTime: time,
            usedTime: 0,
        } as ServerFishInfo;
        game.event.once(GameEvent.AddFish, (fish: FishModel) => {
            const start = Date.now();
            fish.event.once(FishEvent.Destroy, () => {
                const duration = Date.now() - start;
                console.log(`test:>fish_total_time:>`, duration, time);
            });
        });
        game.addFish(fish_data);
    });
});

export function genFishInfo(
    typeId: number,
    pathId: number,
    totalTime: number,
    usedTime = 0,
) {
    return {
        eid: '00' + typeId,
        fishId: `${typeId}`,
        displaceType: 'path',
        pathNo: `${pathId}`,
        totalTime,
        usedTime,
    } as ServerFishInfo;
}
