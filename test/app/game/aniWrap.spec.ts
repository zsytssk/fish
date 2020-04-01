import { range } from 'lodash';
import { Test } from 'testBuilder';
import { loopFreeze, stopFreeze } from 'view/scenes/game/ani_wrap/freeze';
import { activeFreeze } from 'view/scenes/game/ani_wrap/freeze';
import {
    activeShoalWave,
    stopShoalWave,
} from 'view/scenes/game/ani_wrap/shoalWave';
import { activeExploding } from 'view/scenes/game/ani_wrap/exploding';
import { activePosTip } from 'view/scenes/game/ani_wrap/posTip';
import { activeAimFish } from 'view/scenes/game/ani_wrap/aim';
import { modelState } from 'model/modelState';
import { showAwardCoin } from 'view/scenes/game/ani_wrap/award/awardCoin';
import { showAwardCircle } from 'view/scenes/game/ani_wrap/award/awardBig';

/** 冰冻 鱼群 爆炸 瞄准...测试 */
export const ani_wrap = new Test('ani_wrap', runner => {
    runner.describe('active_freezing', () => {
        activeFreeze();
    });
    runner.describe('loop_freezing', () => {
        loopFreeze();
    });
    runner.describe('stop_freezing', () => {
        stopFreeze();
    });

    runner.describe('active_shoal_wave', () => {
        activeShoalWave();
    });
    runner.describe('active_reverse_shoal_wave', () => {
        activeShoalWave(true);
    });
    runner.describe('stop_shoal_wave', () => {
        stopShoalWave();
    });
    runner.describe('show_award_coin', () => {
        const pos = { x: 0, y: -100 };
        const end_pos = { x: 600, y: 600 };
        const num = 100000;
        showAwardCoin(pos, end_pos, num, true);

        setTimeout(() => {
            const pos1 = { x: 1000, y: 100 };
            const end_pos1 = { x: 600, y: 600 };
            const num1 = 100000;
            showAwardCoin(pos1, end_pos1, num1, false);
        }, 3000);
    });
    runner.describe('show_award_circle', (t, d) => {
        const pos = { x: 1000, y: 300 };
        const num = 100000;
        showAwardCircle(pos, num, true, t, d);
    });

    runner.describe('active_exploding', (pos: Point) => {
        const arr = range(5, 6);
        const x_space = 1920 / 10;
        const y_space = 750 / 10;
        for (const n of arr) {
            activeExploding({ x: x_space * n, y: y_space * n });
        }
    });

    runner.describe('pop_tip', () => {
        activePosTip();
    });
    runner.describe('aim', () => {
        const fish = [...modelState.app.game.fish_list][0];
        activeAimFish(fish, false, { x: 100, y: 100 });
    });
});
