import { Test } from 'testBuilder';
import Alert, { alert_url } from 'view/pop/alert';
import { sleep } from './utils/testUtils';
import honor, { Honor } from 'honor';
import Tip, { tip_url } from 'view/pop/tip';
import Alert1 from 'view/pop/alert1';
import EmptyPop from 'view/pop/emptyPop';

export default new Test('dialog', runner => {
    /** 打开弹出层 url --> 关闭 */
    runner.describe('open_dialog_by_url', async () => {
        const dialog = await Alert.preOpen(`this is a test!`);
        console.log(dialog);
        // await sleep(3);
        // honor.director.closeDialogByName(alert_url);
    });

    /** 打开弹出层 class --> 关闭 */
    runner.describe('open_dialog_by_class', async () => {
        const dialog = await honor.director.openDialog(Alert);
        console.log(dialog);
        // await sleep(3);
        // honor.director.closeDialogByName(alert_url);
    });
    /** 打开弹出层 class --> 关闭 */
    runner.describe('open_dialog_by_empty_class', async () => {
        EmptyPop.preEnter();
    });

    /** 打开同一个dialog多次, 看是否是同一个dialog */
    runner.describe('open_dialog_multi', async () => {
        const dialog = await Alert.preOpen(`this is a test!`);
        await sleep(1);
        dialog.close();
        await sleep(1);
        const dialog2 = await Alert.preOpen(`this is a test!`);
        console.log(dialog === dialog2);
    });

    runner.describe('open_dialog_use_exit', async () => {
        honor.director.openDialog(
            alert_url,
            ['this is a test1!'],
            undefined,
            true,
        );
        honor.director.openDialog(
            alert_url,
            ['this is a test2!'],
            undefined,
            true,
        );
    });

    /** config_close_on_side */
    runner.describe('open_dialog_use_exit2', async () => {
        honor.director.openDialog(
            tip_url,
            ['this is a test1!'],
            undefined,
            true,
        );
        await sleep(1);
        honor.director.openDialog(alert_url, ['this is a test1!']);
        await sleep(1);
        honor.director.openDialog(
            tip_url,
            ['this is a test1!'],
            undefined,
            true,
        );
    });

    /** config autoClose */
    runner.describe('config_auto_close', async () => {
        honor.director.openDialog(
            alert_url,
            ['this is a test1!'],
            { autoClose: 5000 },
            true,
        );
    });

    /** shadow */
    runner.describe('config_shadow', async () => {
        honor.director.openDialog(alert_url, ['this is a test1!']);
        await sleep(3);
        honor.director.openDialog(alert_url, ['this is a test1!'], {
            shadowColor: '#fff',
        });
    });

    /** config_close_other */
    runner.describe('config_close_other', async () => {
        honor.director.openDialog(alert_url, ['this is a test1!']);
        await sleep(3);
        honor.director.openDialog(tip_url, ['this is a test1!'], {
            closeOther: true,
        });
    });

    /** config_close_on_side */
    runner.describe('config_close_on_side', async () => {
        honor.director.openDialog(alert_url, ['this is a test1!'], {
            closeOnSide: true,
        });
        honor.director.openDialog(tip_url, ['this is a test1!'], {
            closeOnSide: true,
        });
    });

    /** 获取 弹出层 */
    runner.describe('get_dialog_by_name', async () => {
        const alert = await honor.director.openDialog(alert_url, [
            'this is a test1!',
        ]);
        const tip = await honor.director.openDialog(tip_url, [
            'this is a test1!',
        ]);
        alert.name = 'alert';
        tip.name = 'tip';
        await sleep(1);
        tip.close();
        await sleep(1);
        const dialog1 = honor.director.getDialogByName('alert');
        const dialog2 = honor.director.getDialogByName('tip');
        console.log(dialog1 === alert);
        console.log(dialog2 === tip);
    });

    /** 关闭所有 弹出层 */
    runner.describe('close_dialog_all', async () => {
        await Alert.preOpen(`this is a test!`);
        await sleep(1);
        await Tip.preOpen(`this is a test!`);
        await sleep(1);
        honor.director.closeAllDialogs();
    });

    /** 关闭所有 弹出层 */
    runner.describe('alert_loading', async () => {
        await Alert.preOpen(`this is a test!`);
        await sleep(1);
        await Alert1.preOpen(`this is a test!`);
    });

    /** dialog zOrder */
    runner.describe('dialog_zorder', async () => {
        // const dialog = await Alert.preOpen(`this is a test!`);
        const dialog2 = await Alert1.preOpen(`this is a test!`);
        // await Honor.director.openDialog(window.loading);
        console.log(dialog2);
    });
});
