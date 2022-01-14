import { Laya } from 'Laya';
import honor, { HonorDialog } from 'honor';
import { getStringLength } from 'honor/utils/getStringLength';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { fade_in, fade_out, slide_down_in } from '@app/utils/animate';
import { startCount } from '@app/utils/count';

export default class ArenaTaskTipPop
    extends ui.pop.alert.arenaTaskTipUI
    implements HonorDialog
{
    public static instance: ArenaTaskTipPop;
    public zOrder = 100;
    constructor() {
        super();
    }
    public static async tip(msg: string, time = 3) {
        AudioCtrl.play(AudioRes.PopShow);
        const tip_dialog = await honor.director.openDialog<ArenaTaskTipPop>(
            'pop/alert/arenaTaskTip.scene',
            { before_open_param: msg },
        );
        this.instance = tip_dialog;
        await tip_dialog.tip(msg, time);
    }
    public static async hide() {
        const { instance } = this;
        if (instance?.visible) {
            instance?.close();
        }
    }
    public onBeforeOpen(msg: string) {
        this.analysisSize(msg);
    }

    /**显示提示信息
     * @param msg 提示的信息
     */
    public tip(msg: string, time: number) {
        return new Promise<void>((resolve, _reject) => {
            if (!msg) {
                return resolve();
            }

            startCount(time, 1, (radio: number) => {
                if (radio === 0) {
                    this.close();
                    resolve();
                }
            });

            this.setTipText(msg);
        });
    }
    /** 通过文字有多少行来确定高度, 通过一行最多有多少字来确定 宽度 */
    private analysisSize(msg: string) {
        const { label, bg } = this;

        const line_char_list = msg.split('\n');
        const line_num = line_char_list.length;
        const max_lin_char = maxLineCharNum(line_char_list);

        let width = 100 + max_lin_char * 18; // 每增加一个字增加的宽度
        let height = 18 + line_num * 30; // 每增加一行增加的高度
        width = width > 750 ? width : 750;
        height = height > 48 ? height : 48;

        // 画一个圆角背景
        this.width = label.width = bg.width = width;
        this.height = label.height = bg.height = height;

        this.x = (Laya.stage.width - this.width) / 2;

        function maxLineCharNum(line_list: string[]) {
            const arr = [];
            for (const line_item of line_list) {
                arr.push(getStringLength(line_item));
            }
            return Math.max.apply(this, arr);
        }
    }
    private setTipText(msg: string) {
        const { label } = this;
        label.text = msg;
        this.visible = false;
        fade_in(this, 300);
    }
}
