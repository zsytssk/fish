import ShopPop from '@app/view/pop/shop';

import shopData from './shop.json';

export const shop_test = {
    open: async () => {
        ShopPop.preEnter();
    },
    renderData: async () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const shop = await ShopPop.preEnter();
            setTimeout(() => {
                shop.initData(shopData);
                resolve();
            }, 1000);
        }) as Promise<void>;
    },
    use_gun_skin: async () => {
        await shop_test.renderData();
        const pop = await ShopPop.preEnter();
        pop.useGunSkin(shopData.gun[1].id);

        setTimeout(() => {
            pop.useGunSkin(shopData.gun[3].id);
        }, 3000);
    },
    buy_gun_skin: () => {
        /*  */
    },
};
