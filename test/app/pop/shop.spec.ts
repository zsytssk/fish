import { Test } from 'testBuilder';
import * as shopData from './shop.json';
import ShopPop from 'view/pop/shop';
import honor from 'honor';

export const shop_test = new Test('shop', (runner) => {
    runner.describe('open', async () => {
        ShopPop.preEnter();
    });
    runner.describe('render_data', async () => {
        return new Promise(async (resolve) => {
            const shop = (await honor.director.openDialog(ShopPop)) as ShopPop;
            setTimeout(() => {
                shop.initData(shopData);
                resolve();
            }, 1000);
        }) as Promise<void>;
    });
    runner.describe('use_gun_skin', async () => {
        await shop_test.runTest('render_data');
        const pop = (await honor.director.openDialog(ShopPop)) as ShopPop;
        pop.useGunSkin(shopData.gun[1].id);

        setTimeout(() => {
            pop.useGunSkin(shopData.gun[3].id);
        }, 3000);
    });
    runner.describe('buy_gun_skin', () => {});
});
