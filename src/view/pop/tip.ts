import honor, { HonorDialog } from 'honor';
import { getStringLength } from 'honor/utils/getStringLength';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { startCount, clearCount } from '@app/utils/count';

import { showNodeZone } from '../../../test/utils/testUtils';

type TipPopOpt = {
    count: number;
    show_count?: boolean;
    click_through?: boolean;
    auto_hide?: boolean;
};
const DefaultOpt = {
    count: 2,
    click_through: true,
    auto_hide: true,
};
export default class TipPop extends ui.pop.alert.tipUI implements HonorDialog {
    public isModal = true;
    private count_id: number;
    private static instance: TipPop;
    public static async tip(msg: string, opt?: TipPopOpt) {
        AudioCtrl.play(AudioRes.PopShow);
        this.instance = (await honor.director.openDialog(
            { dialog: TipPop, use_exist: true },
            {
                beforeOpen(dialog: TipPop) {
                    dialog.analysisSize(msg);
                },
            },
        )) as TipPop;
        await this.instance.tip(msg, opt);
    }
    public static async hide() {
        if (this.instance) {
            this.instance.close();
        }
    }
    public onResize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pivotX = width / 2;
        this.pivotY = height / 2;
    }
    /** 显示提示信息
     * @param msg 提示的信息
     */
    public tip(msg: string, opt = {} as TipPopOpt) {
        return new Promise((resolve, reject) => {
            if (!msg) {
                return resolve();
            }
            opt = {
                ...DefaultOpt,
                ...opt,
            };
            const { count, show_count, click_through, auto_hide } = opt;
            const new_msg = show_count ? `${msg} ${count}` : msg;

            this.mouseThrough = click_through;
            clearCount(this.count_id);
            this.count_id = startCount(count, 1, (radio: number) => {
                if (show_count) {
                    const count_now = Math.floor(count * radio);
                    this.setTipText(`${msg} ${count_now}`);
                }
                if (radio === 0) {
                    if (auto_hide) {
                        this.close();
                    }
                    resolve();
                }
            });
            this.show();
            this.setTipText(new_msg);
        });
    }
    /** 通过文字有多少行来确定高度, 通过一行最多有多少字来确定 宽度 */
    private analysisSize(msg: string) {
        const { label, bg, inner } = this;

        const line_char_list = msg.split('\n');
        const line_num = line_char_list.length;
        const max_lin_char = maxLineCharNum(line_char_list);

        let width = 100 + max_lin_char * 15; // 每增加一个字增加的宽度
        let height = 50 + line_num * 30; // 每增加一行增加的高度
        width = width > 300 ? width : 300;
        height = height > 120 ? height : 120;

        // 画一个圆角背景
        inner.width = label.width = bg.width = width;
        inner.height = label.height = bg.height = height;

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
    }
}
