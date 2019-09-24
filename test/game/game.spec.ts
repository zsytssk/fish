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
        for (let i = 0; i < 10; i++) {
            const fish_data = {
                fishId: '00' + i,
                typeId: `${i + 1}`,
                displaceType: 'path',
                pathNo: `${i + 1}`,
                totalTime: 10,
                usedTime: 0,
            } as ServerFishInfo;
            state.game_model.addFish(fish_data);
        }
    });
});
