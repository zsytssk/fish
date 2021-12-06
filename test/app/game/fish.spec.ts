import { range } from 'lodash';
import { Test } from 'testBuilder';

import { injectProto } from 'honor/utils/tool';
import { Label } from 'laya/ui/Label';

import { FishCtrl } from '@app/ctrl/game/fishCtrl';
import { FishEvent, FishModel } from '@app/model/game/fish/fishModel';
import { GameEvent } from '@app/model/game/gameModel';
import { modelState } from '@app/model/modelState';
import { sleep } from '@app/utils/animate';

import { body_test } from './body.spec';

type FishModelPath = FishModel & {
    path_no: number;
};

/** @type {FishModel} 的测试 */
export const fish_test = {
    addFish: async (typeId = 15, pathId = 2, time?: number) => {
        // pathId = pathId || 3;
        // time = time || 12 * 1000000;
        time = time || 10 * 1000;
        const usedTime = (time * 1) / 5;
        // const usedTime = 0;
        const fish_data = genFishInfo(typeId, pathId, time, usedTime);
        modelState.app.game.addFish(fish_data);
    },

    fishView: async (typeId: number, pathId: number, time: number) => {
        for (const i of range(16, 21)) {
            typeId = i;
            pathId = i;
            time = time || 12;
            const fish_data = genFishInfo(typeId, pathId, time * 1000);
            const fishModel = modelState.app.game.addFish(
                fish_data,
            ) as FishModelPath;
            fishModel.path_no = pathId;
            await sleep(time);
        }

        // typeId = 20;
        // pathId = pathId || 2;
        // // pathId = pathId || 3;
        // time = time || 12 * 1000;
        // // time = time || 40 * 1000;
        // const usedTime = (time * 1) / 2;
        // // const usedTime = 0;
        // const fish_data = genFishInfo(typeId, pathId, time, usedTime);
        // modelState.app.game.addFish(fish_data);
    },

    fishPath: async (typeId: number, pathId: number, time: number) => {
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

    fishAni: async () => {
        for (const i of range(1, 11)) {
            const typeId = i;
            const pathId = 62;
            const time = 30 * 1000;
            const fish_data = genFishInfo(typeId, pathId, time, time / 3);

            modelState.app.game.addFish(fish_data);
            await sleep(10);
        }
    },

    /** 鱼组的测试 */
    addFishGroup: () => {
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
            usedTime: time / 3,
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
    },

    /** 鱼组的测试 */
    fishTotalTime: () => {
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
    },

    fishDirectTest: async () => {
        // body_test.runTest('show_shape');
        const typeId = 20;
        for (const i of range(1, 21)) {
            const pathId = i;
            const time = 15000;
            const fish_data = genFishInfo(typeId, pathId, time);
            modelState.app.game.addFish(fish_data);
            await sleep(5);
        }
    },

    fishShadow: async () => {
        // body_test.runTest('show_shape');
        for (const i of range(1, 21)) {
            const typeId = i;
            const pathId = 2;
            const time = 15000;
            const fish_data = genFishInfo(typeId, pathId, time);
            modelState.app.game.addFish(fish_data);
            await sleep(5);
        }
    },

    getClickFish: () => {
        injectProto(FishCtrl, 'initEvent' as any, (fish: FishCtrl) => {
            fish['view'].once('click', null, () => {
                console.log(`click_fish:>`, fish['view'], fish['model']);
            });
        });
    },

    listPlayerId: () => {
        const fish_list = modelState.app.game['fish_map'];
        const id_list = [...fish_list.values()].map((fish) => {
            return fish.id;
        });

        console.log(`fish_list:>`, id_list);
    },

    fishShape: async (typeId: number, pathId: number, time: number) => {
        body_test.showShape();
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

    bombOtherFish: async () => {
        for (const i of range(9, 11)) {
            const typeId = 20;
            const pathId = i;
            const time = 20000000;
            const fish_data = genFishInfo(typeId, pathId, time, time / 3);
            modelState.app.game.addFish(fish_data);
        }
    },
};

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
        currencyFish: 'BUSDT',
    } as ServerFishInfo;
}
