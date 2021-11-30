import { Test } from 'testBuilder';

import { tipExchange } from '@app/ctrl/game/gameCtrlUtils';
import { asyncOnly, clearAsyncOnly } from '@app/utils/asyncQue';
import AlertPop from '@app/view/pop/alert';
import TipPop from '@app/view/pop/tip';
import TopTipPop from '@app/view/pop/topTip';

import { sleep } from '../../utils/testUtils';

export const alert_test = new Test('alert', (runner) => {
    runner.describe('top_tip', async (msg) => {
        TipPop.tip(msg || '点击屏幕内您想投放炸弹的位置');
    });
    runner.describe('show_tip', async (msg) => {
        // TipPop.tip(msg || 'this is a test', {
        //     count: 10,
        //     show_count: true,
        //     click_through: false,
        //     auto_hide: false,
        // });
        // TipPop.tip(msg || 'this is a test');
        // console.log(`2`);
        tipExchange({ bringAmount: 100, bulletNum: 100, currency: 'BTC' });
        // await sleep(5);
        // TipPop.hide();
    });
    runner.describe('show_alert', () => {
        AlertPop.alert('this is a test', {
            hide_cancel: true,
            confirm_text: 'reeresrs',
        });

        sleep(3).then(() => {
            AlertPop.alert('this is a test');
        });
    });

    runner.describe('show_alert_only', async (name?: string, msg?: string) => {
        name = name || 'test';
        const data = await asyncOnly(
            name,
            () => {
                return AlertPop.alert(msg || 'this is a test').then((type) => {
                    clearAsyncOnly(name);
                    return type;
                });
            },
            true,
        );
        console.log(data);
    });
});
