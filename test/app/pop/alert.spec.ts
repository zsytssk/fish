import { tipExchange } from '@app/ctrl/game/gameCtrlUtils';
import { asyncOnly, clearAsyncOnly } from '@app/utils/asyncQue';
import { tplIntr } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';
import TipPop from '@app/view/pop/tip';
import TopTipPop from '@app/view/pop/topTip';

import { sleep } from '../../utils/testUtils';

export const alert_test = {
    topTip: async (msg) => {
        TopTipPop.tip(tplIntr('logoutTip'), 3);
        setTimeout(() => {
            TopTipPop.tip(msg || '点击屏幕内您想投放炸弹的位置');
        }, 5 * 1000);
    },
    showTip: async (msg) => {
        TipPop.tip(`this is a test1`, { count: 15 });
        await sleep(3);
        TipPop.tip(tplIntr('taskStartTip'), {
            count: 10,
            show_count: true,
            click_through: false,
        });
        await sleep(3);
        TipPop.tip(`this is a test2`, { count: 5 });
        await sleep(1);
        TipPop.tip(`this is a test3`, { count: 3 });
    },
    showAlert: () => {
        AlertPop.alert('this is a test', {
            hide_cancel: true,
            confirm_text: 'reverse',
            close_on_side: false,
        });

        sleep(3).then(() => {
            AlertPop.alert('this is a test');
        });
    },

    showAlertOnly: async (name?: string, msg?: string) => {
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
    },
};
