import { range } from 'lodash';
import SAT from 'sat';
import { Test } from 'testBuilder';

import { FishEvent } from '@app/model/game/fish/fishModel';
import { modelState } from '@app/model/modelState';
import {
    activeAimFish,
    createPoints,
} from '@app/view/scenes/game/ani_wrap/aim';
import { showAwardCircle } from '@app/view/scenes/game/ani_wrap/award/awardBig';
import { showAwardCoin } from '@app/view/scenes/game/ani_wrap/award/awardCoin';
import { awardSkill } from '@app/view/scenes/game/ani_wrap/award/awardSkill';
import { activeExploding } from '@app/view/scenes/game/ani_wrap/exploding';
import { loopFreeze, stopFreeze } from '@app/view/scenes/game/ani_wrap/freeze';
import { activeFreeze } from '@app/view/scenes/game/ani_wrap/freeze';
import { activePosTip } from '@app/view/scenes/game/ani_wrap/posTip';
import {
    activeShoalWave,
    stopShoalWave,
} from '@app/view/scenes/game/ani_wrap/shoalWave';

/** 冰冻 鱼群 爆炸 瞄准...测试 */
export const ani_wrap = new Test('ani_wrap', (runner) => {
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
        const pos = { x: 1200, y: 700 };
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

    runner.describe('pos_tip', () => {
        const pop_tip_ani = activePosTip();
        pop_tip_ani.x = 300;
        pop_tip_ani.y = 200;
    });
    runner.describe('aim', () => {
        const gun = [...modelState.app.game['player_list']][0].gun;
        const [_, fish] = [...modelState.app.game.fish_map][0];
        fish.event.on(FishEvent.Move, () => {
            const { pos } = fish;
            const x = pos.x - gun.pos.x;
            const y = pos.y - gun.pos.y;
            gun.setDirection(new SAT.Vector(x, y));
            activeAimFish(fish, false, gun.pos);
        });
    });

    runner.describe('aim2', (end_pos = { x: 1000, y: 300 }) => {
        createPoints({ x: 100, y: 300 }, end_pos);
    });
    runner.describe('awardSkill', (end_pos = { x: 1000, y: 300 }) => {
        awardSkill(
            { x: 100, y: 300 },
            end_pos,
            [{ itemNum: 10, itemId: '3001' }],
            'BUSDT',
        );
    });
});
