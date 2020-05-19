import { FishCtrl } from 'ctrl/game/fishCtrl';
import { injectProto } from 'honor/utils/tool';
import { Label } from 'laya/ui/Label';
import { range } from 'lodash';
import { FishEvent, FishModel } from 'model/game/fish/fishModel';
import { GameEvent } from 'model/game/gameModel';
import { modelState } from 'model/modelState';
import { Test } from 'testBuilder';
import { sleep } from 'utils/animate';
import { body_test } from './body.spec';

/** @type {FishModel} 的测试 */
export const fish_test = new Test('fish', runner => {
    runner.describe(
        'add_fish',
        async (typeId: number, pathId: number, time: number) => {
            typeId = 16;
            pathId = pathId || 2;
            // pathId = pathId || 3;
            time = time || 12 * 100000;
            // time = time || 40 * 1000;
            const usedTime = (time * 1) / 2;
            const fish_data = genFishInfo(typeId, pathId, time, usedTime);
            modelState.app.game.addFish(fish_data);
        },
    );

    type FishModelPath = FishModel & {
        path_no: number;
    };
    runner.describe(
        'fish_path',
        async (typeId: number, pathId: number, time: number) => {
            injectProto(FishCtrl, 'init' as any, async (obj: FishCtrl) => {
                await sleep(1);
                const model = obj['model'] as FishModelPath;
                const view = obj['view'];
                const label = new Label();
                label.fontSize = 100;
                label.text = model.path_no + '';
                label.width = view.width;
                label.color = 'red';
                label.align = 'center';
                view.addChild(label);
                label.zOrder = 100;
            });

            for (const i of range(1, 100)) {
                typeId = 15;
                pathId = i;
                time = time || 12;
                const fish_data = genFishInfo(typeId, pathId, time * 1000);
                const fishModel = modelState.app.game.addFish(
                    fish_data,
                ) as FishModelPath;
                fishModel.path_no = pathId;
                await sleep(time);
            }
        },
    );

    runner.describe('fish_ani', async () => {
        for (const i of range(1, 11)) {
            const typeId = i;
            const pathId = 62;
            const time = 30 * 1000;
            const fish_data = genFishInfo(typeId, pathId, time, time / 3);

            modelState.app.game.addFish(fish_data);
            await sleep(10);
        }
    });

    /** 鱼组的测试 */
    runner.describe('add_fish_group', () => {
        // body_test.runTest('show_shape');
        const game = modelState.app.game;
        const typeId = 'G2';
        const pathId = 3;
        const time = 40 * 1000;
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

    runner.describe('fish_direct_test', async () => {
        // body_test.runTest('show_shape');
        const typeId = 20;
        for (const i of range(1, 21)) {
            const pathId = i;
            const time = 15000;
            const fish_data = genFishInfo(typeId, pathId, time);
            modelState.app.game.addFish(fish_data);
            await sleep(5);
        }
    });
    runner.describe('fish_shadow', async () => {
        // body_test.runTest('show_shape');
        for (const i of range(1, 21)) {
            const typeId = i;
            const pathId = 2;
            const time = 15000;
            const fish_data = genFishInfo(typeId, pathId, time);
            modelState.app.game.addFish(fish_data);
            await sleep(5);
        }
    });

    runner.describe('get_click_fish', () => {
        injectProto(FishCtrl, 'initEvent' as any, (fish: FishCtrl) => {
            fish['view'].once('click', null, () => {
                console.log(`click_fish:>`, fish['view'], fish['model']);
            });
        });
    });

    runner.describe('list_player_id', () => {
        const fish_list = modelState.app.game['fish_list'];
        const id_list = [...fish_list].map(fish => {
            return fish.id;
        });

        console.log(`fish_list:>`, id_list);
    });

    runner.describe(
        'fish_shape',
        async (typeId: number, pathId: number, time: number) => {
            body_test.runTest('show_shape');
            for (let i = 6; i < 21; i++) {
                typeId = i;
                pathId = pathId || 3;
                time = time || 100000000;
                const usedTime = time / 2;
                const fish_data = genFishInfo(typeId, pathId, time, usedTime);
                const fish_model = modelState.app.game.addFish(fish_data);
                await sleep(3);
                (fish_model as FishModel).destroy();
            }
        },
    );

    runner.describe('bomb_other_fish', async () => {
        for (const i of range(9, 11)) {
            const typeId = 20;
            const pathId = i;
            const time = 20000000;
            const fish_data = genFishInfo(typeId, pathId, time, time / 3);
            modelState.app.game.addFish(fish_data);
        }
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
