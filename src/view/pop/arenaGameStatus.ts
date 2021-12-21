import honor, { HonorDialog } from 'honor';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { startCount } from '@app/utils/count';

export default class ArenaGameStatus
    extends ui.pop.alert.arenaGameStatusUI
    implements HonorDialog
{
    public isShowEffect = false;
    public isPopupCenter = true;
    public static instance: ArenaGameStatus;
    public zOrder = 100;
    constructor() {
        super();
    }
    public static async start() {
        AudioCtrl.play(AudioRes.PopShow);
        const tip_dialog = (await honor.director.openDialog(
            ArenaGameStatus,
        )) as ArenaGameStatus;
        this.instance = tip_dialog;
        await tip_dialog.start();
    }
    public static async end() {
        AudioCtrl.play(AudioRes.PopShow);
        const tip_dialog = (await honor.director.openDialog(
            ArenaGameStatus,
        )) as ArenaGameStatus;
        this.instance = tip_dialog;
        await tip_dialog.end();
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
    public start(time = 3) {
        return new Promise<void>((resolve, _reject) => {
            startCount(time, 1, (radio: number) => {});
        });
    }
    /** 通过文字有多少行来确定高度, 通过一行最多有多少字来确定 宽度 */
    public end() {}
}
