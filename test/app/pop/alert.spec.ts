import { Test } from 'testBuilder';
import TipPop from 'view/pop/tip';
import AlertPop from 'view/pop/alert';
import TopTipPop from 'view/pop/topTip';
import { sleep } from '../../utils/testUtils';
import { asyncOnly, clearAsyncOnly } from 'utils/asyncQue';

export const alert_test = new Test('alert', runner => {
    runner.describe('top_tip', () => {
        TopTipPop.tip('点击屏幕内您想投放炸弹的位置');
    });
    runner.describe('show_tip', async msg => {
        TipPop.tip(msg || 'this is a test', {
            count: 10,
            show_count: true,
            click_through: false,
            auto_hide: false,
        });
        console.log(`2`);
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
                return AlertPop.alert(msg || 'this is a test').then(type => {
                    clearAsyncOnly(name);
                    return type;
                });
            },
            true,
        );
        console.log(data);
    });
});
