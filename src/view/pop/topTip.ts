import honor, { HonorDialog } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { startCount } from 'utils/count';
import { getStringLength } from 'honor/utils/getStringLength';
import { slide_down_in } from 'utils/animate';

const url = 'pop/alert/topTip.scene';
export default class TopTipPop extends ui.pop.alert.topTipUI
    implements HonorDialog {
    public isShowEffect = false;
    public isPopupCenter = false;
    constructor() {
        super();
        console.log(this.isShowEffect);
    }
    public static async tip(msg: string, time = 3) {
        const tip_dialog = (await honor.director.openDialog(url)) as TopTipPop;
        await tip_dialog.tip(msg, time);
    }
    /**显示提示信息
     * @param msg 提示的信息
     */
    public tip(msg: string, time: number) {
        return new Promise((resolve, reject) => {
            if (!msg) {
                return resolve();
            }

            startCount(time, 1, (radio: number) => {
                if (radio === 0) {
                    this.close();
                    resolve();
                }
            });
            this.analysisSize(msg);
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
        let height = 30 + line_num * 30; // 每增加一行增加的高度
        width = width > 750 ? width : 750;
        height = height > 70 ? height : 70;

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
        slide_down_in(this);
    }
}
