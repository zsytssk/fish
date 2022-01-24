import honor, { HonorDialog } from 'honor';
import { OpenDialogOpt } from 'honor/ui/dialogManager';

import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from '@app/data/audioRes';
import { ui } from '@app/ui/layaMaxUI';
import { tween } from '@app/utils/animate';
import { clearCount, startCount } from '@app/utils/count';

type TipPopOpt = {
    count?: number;
    show_count?: boolean;
    click_through?: boolean;
    auto_hide?: boolean;
    repeat?: boolean;
};
const DefaultOpt = {
    count: 2,
    click_through: true,
    auto_hide: true,
};

export type TipJsonItem = {
    color?: string;
    msg: string;
};
type Msg = string | TipJsonItem[];

const default_item_tpl = '<span style="color:{color};">{msg}</span>';

export default class TipPop extends ui.pop.alert.tipUI implements HonorDialog {
    private count_id: number;
    private static instances: TipPop[] = [];
    private task_len: number[] = [];
    public _zOrder = 1001;
    public get zOrder() {
        return this._zOrder;
    }
    public set zOrder(value) {
        this._zOrder = value;
    }
    public static async tip(
        msg: Msg,
        opt?: TipPopOpt,
        dialogOpt?: OpenDialogOpt<TipPop>,
    ) {
        dialogOpt = dialogOpt || {};
        AudioCtrl.play(AudioRes.PopShow);
        const instance = await honor.director.openDialog<TipPop>(
            'pop/alert/tip.scene',
            {
                stay_scene: false,
                use_exist: false,
                ...dialogOpt,
            },
        );
        return instance.tip(msg, opt);
    }
    public static instancesAdd(instance: TipPop) {
        const index = this.instances.indexOf(instance);
        if (index !== -1) {
            this.instances.splice(index, 1);
        }
        this.instances.unshift(instance);
        this.organizeInstance();
    }
    public static instancesRemove(instance: TipPop) {
        const index = this.instances.indexOf(instance);
        if (index !== -1) {
            this.instances.splice(index, 1);
        }
        this.organizeInstance();
    }
    public static async organizeInstance() {
        const { instances } = this;
        const space = 20;

        let all_size = 0;
        for (const [index, item] of instances.entries()) {
            all_size += item.inner.height;
            if (index !== instances.length - 1) {
                all_size += space;
            }
        }

        for (const [index, item] of instances.entries()) {
            let y = 0;
            for (const [hIndex, item2] of instances.entries()) {
                if (hIndex === index) {
                    y += item2.inner.height / 2;
                    break;
                }
                y += item2.inner.height + space;
            }
            tween({
                sprite: item.inner,
                end_props: { centerY: y - all_size / 2 } as any,
                time: 200,
            });
        }
    }

    public onAwake(): void {
        const { html_div } = this;
        html_div.style.fontSize = 24;
        html_div.style.color = `#fff`;
        html_div.style.align = 'center';
        html_div.style.valign = 'middle';
        html_div.style.stroke = 2;
        html_div.style.leading = 5;
        html_div.style.strokeColor = `#000`;
        html_div.style.fontWeight = `bold`;
        html_div.style.whiteSpace = 'nowrap';
        html_div.y = 40;
        html_div.x = 40;
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
    public tip(msg: Msg, opt = {} as TipPopOpt) {
        return new Promise<void>((resolve, _reject) => {
            if (!msg) {
                return resolve();
            }
            opt = {
                ...DefaultOpt,
                ...opt,
            };
            const { count, show_count, click_through, auto_hide, repeat } = opt;
            this.mouseThrough = click_through;
            this.task_len.push(1);

            const fn = () => {
                clearCount(this.count_id, true);
                this.count_id = startCount(count, 1, (radio: number) => {
                    if (show_count) {
                        const count_now = Math.floor(count * radio);
                        this.setTipText(msg, `${count_now}`);
                    }
                    if (radio === 0) {
                        this.task_len.pop();
                        if (auto_hide) {
                            // 最后一个需要显示才隐藏
                            this.close();
                        }
                        if (repeat) {
                            fn();
                        }
                        setTimeout(() => {
                            resolve();
                        });
                    }
                });
            };

            fn();

            this.setTipText(msg, show_count ? `${count}` : '', true);
            this.show();
        });
    }
    public onClosed() {
        const index = TipPop.instances.indexOf(this);
        if (index !== -1) {
            TipPop.instances.splice(index, 1);
        }
        TipPop.instancesRemove(this);
    }

    private setTipText(msg: Msg, count = '', organize = false) {
        const { html_div, bg, inner } = this;
        const html = this.jsonToHtml(msg);
        html_div.innerHTML = html + count;

        const width = html_div.contextWidth + 80;
        const height = html_div.contextHeight + 80;

        inner.width = bg.width = width;
        inner.height = bg.height = height;
        if (organize) {
            TipPop.instancesAdd(this);
        }
    }
    /** 将提示的信息json转化为html */
    private jsonToHtml(tip_data: Msg) {
        if (typeof tip_data === 'string') {
            return tip_data;
        }

        /** 拼接字符的模版 */
        let html = '';
        for (const tip_item of tip_data) {
            /** 当个item生成的span */
            let html_item = default_item_tpl;
            for (const key in tip_item) {
                const str = tip_item[key];
                if (str === '<br/>') {
                    html_item = '<br/>';
                } else {
                    const reg = new RegExp('{' + key + '}', 'g');
                    html_item = html_item.replace(reg, tip_item[key]);
                }
            }
            html += html_item;
        }
        return html;
    }
}
