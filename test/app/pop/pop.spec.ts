import { Test } from 'testBuilder';
import BuyBulletPop from 'view/pop/buyBullet';

export const pop_test = new Test('pop', runner => {
    runner.describe('open_buy_bullet', async () => {
        BuyBulletPop.preEnter();
    });
});
