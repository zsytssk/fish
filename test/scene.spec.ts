import Alert from 'view/pop/alert';
import { Test } from 'testBuilder';
import Start from 'view/scenes/start';
import { sleep } from './utils/testUtils';
import EmptyScene from 'view/scenes/emptyScene';

export default new Test('scene', runner => {
    /** 切换场景 url --> 关闭 */
    runner.describe('open_scene', async () => {
        await Alert.preOpen(`this is a test!`);
        await sleep(2);
        Start.preEnter();
    });

    /** 打开弹出层 class --> 关闭 */
    runner.describe('open_scene', async () => {});

    /** 打开弹出层 empty class --> 关闭 */
    runner.describe('open_empty_scene', async () => {
        EmptyScene.preEnter();
    });
});
