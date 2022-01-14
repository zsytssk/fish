import honor, { HonorDialog } from 'honor';
import { openDialog } from 'honor/ui/sceneManager';
import { Ease } from 'laya/utils/Ease';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { fade_out, scale_in, sleep } from '@app/utils/animate';

export default class ArenaGameStatus
    extends ui.pop.alert.arenaGameStatusUI
    implements HonorDialog
{
    public isShowEffect = false;
    public isPopupCenter = true;
    public static instance: ArenaGameStatus;
    constructor() {
        super();
    }
    public static async start() {
        const pop = await openDialog<ArenaGameStatus>(
            'pop/alert/arenaGameStatus.scene',
            {
                use_exist: true,
            },
        );
        this.instance = pop;
        AudioCtrl.play(AudioRes.PopShow);
        await pop.start();
        return pop;
    }
    public static async end() {
        AudioCtrl.play(AudioRes.PopShow);
        const pop = await openDialog<ArenaGameStatus>(
            'pop/alert/arenaGameStatus.scene',
            {
                use_exist: true,
            },
        );
        this.instance = pop;
        await pop.end();
        return pop;
    }
    public static async hide() {
        const { instance } = this;
        if (instance?.visible) {
            instance?.close();
        }
    }
    /**显示提示信息
     * @param msg 提示的信息
     */
    public async start() {
        const { start_node, end_node, count_label, count_box } = this;
        end_node.visible = start_node.visible = false;

        count_label.text = '3';
        await scale_in(count_box, 500, Ease.elasticOut);

        count_label.text = '2';
        await scale_in(count_box, 500, Ease.elasticOut);
        count_label.text = '1';
        await scale_in(count_box, 500, Ease.elasticOut);
        count_box.visible = false;
        await scale_in(start_node, 400, Ease.elasticOut);
        await sleep(0.5);
        await fade_out(start_node, 400);
    }
    /** 通过文字有多少行来确定高度, 通过一行最多有多少字来确定 宽度 */
    public async end() {
        const { start_node, end_node, count_box } = this;
        end_node.visible = start_node.visible = count_box.visible = false;
        await scale_in(end_node, 400, Ease.elasticOut);
        await sleep(0.5);
        await fade_out(end_node, 400);
    }
}
