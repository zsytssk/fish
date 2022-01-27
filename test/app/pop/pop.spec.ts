import BuyBulletPop from '@app/view/pop/buyBullet';

export const pop_test = {
    open_buy_bullet: async () => {
        BuyBulletPop.preEnter({
            id: '2003',
            type: 'bullet',
            num: 10,
            price: 100,
        });
    },
};
