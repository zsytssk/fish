import { state } from 'ctrl/game/gameCtrl';
import { injectAfter } from 'honor/utils/tool';
import { GameCtrl } from 'ctrl/game/gameCtrl';
import { Test } from 'testBuilder';
import { isMainThread } from 'worker_threads';

declare global {
    interface Window {
        state: typeof state;
    }
}
export const game_test = new Test('game', runner => {
    injectAfter(GameCtrl, 'preEnter', () => {
        window.state = state;
    });

    runner.describe('add_fish', () => {
        const fish_data = {
            fishId: '001',
            typeId: '1',
            displaceType: 'path',
            pathNo: '1',
            totalTime: 100,
            usedTime: 0,
        } as ServerFishInfo;
        state.game_model.addFish(fish_data);
    });
});
