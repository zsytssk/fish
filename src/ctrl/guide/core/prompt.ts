import {
    slide_down_in,
    slide_left_in,
    slide_up_in,
    slide_right_in,
} from 'utils/animate';
import { callFunc } from 'utils/utils';
import { Sprite } from 'laya/display/Sprite';
import { HTMLDivElement } from 'laya/html/dom/HTMLDivElement';
import { Event } from 'laya/events/Event';
import { Laya } from 'Laya';

export type TipJsonItem = {
    color: string;
    msg: string;
    fontSize: number;
};
export type TipItem = string | TipJsonItem[];
export type TipData = TipItem | TipItem[];
export type PromptPos = 'top' | 'left' | 'bottom' | 'right';
/** 提示框显示的位置+方位(用来做显示动画) */
export type PromptLocation = {
    /*位置 */
    pos: Point;
    /*方位用于向上 左右 .. 动画出现 */
    dir?: PromptPos;
};

type CompleteStepInfo = {
    /** 要进入的步骤 */
    step: number;
    /** 是否已经显示完整信息, 是否正在等待下一条信息 */
    in_wait: boolean;
    /** 是否已经显示所有信息 */
    is_complete: boolean;
};
type StepInfo = {
    /** 当前显示第几条信息 */
    level_index: number;
    /** 当前显示第level信息几个字母 */
    level_step_index: number;
    /** 是否是最后一条 */
    is_last: boolean;
    /** 是否是level的最后一条 */
    is_level_last: boolean;
};
type View = Sprite & {
    html_div: HTMLDivElement;
};
const default_tpl =
    '<span style="font-size:{fontSize}px;color:{color};">{msg}</span>';

type Style = {
    fontSize: number;
    color: string;
};

const default_style = {
    fontSize: 25,
    color: '#ffe7a7',
};
/** 提示弹出层 */
export class PromptGuide {
    private tip_msg: TipItem[];
    private complete_resolve: FuncVoid;
    /** 自动隐藏 */
    private auto_hide = true;
    /** 记录当前显示的位置 */
    private step = -1;
    /** 记录当前显示的位置 */
    private step_map: number[];
    /** 正在进行提示 */
    public is_going = false;
    public name = 'prompt';
    private view: View;
    private timeout: number;
    private style: Style;
    /** 提示弹出层
     * @param view prompt 的ui
     * @param tpl prompt 的默认模板
     */
    constructor(view: View, style = {} as Partial<Style>) {
        this.view = view;
        this.style = {
            ...default_style,
            ...style,
        };

        const { html_div } = view;
        html_div.style.width = 579;
    }

    /**
     * 显示提示信息
     * @param location 弹出显示的位置 用来处理显示的动画
     * @param tip 提示文字
     * @param callback 显示完成callback
     * @param auto_hide 显示完整提示之后是否自动关闭
     */
    public prompt(location: PromptLocation, tip: TipData, auto_hide = true) {
        return new Promise((resolve, reject) => {
            this.reset();
            this.view.pos(location.pos.x, location.pos.y);

            /** 只需一屏展示: 字符串, 单个[{color: .., msg:...}, ...] */
            if (typeof tip === 'string' || (tip[0] as TipJsonItem).color) {
                this.tip_msg = [tip] as TipItem[];
            } else {
                this.tip_msg = tip as TipItem[];
            }

            this.complete_resolve = resolve;
            this.auto_hide = auto_hide;
            this.is_going = true;
            this.step_map = this.analysisTip(this.tip_msg);

            this.showTip();
            Laya.stage.on(Event.CLICK, this, () => {
                this.jumpLevelLastStep();
            });
            this.show(location.dir);
        });
    }
    /** 走到当前级别的最后一步 */
    private jumpLevelLastStep() {
        const { step_map, step } = this;
        let level_num = 0;
        let level_step = 0;
        for (const step_num of step_map) {
            level_num += step_num;
            level_step = level_num - 1;
            if (level_step > step) {
                break;
            }
        }
        this.showTip(level_step);
    }
    /** 通过step计算当前是哪一步 */
    private getStepInfo(step: number): StepInfo {
        const step_map = this.step_map;

        let level_index = 0;
        let level_step_index = 0;
        let sum = 0;
        /** 最后一条 */
        let is_last = false;
        /** level的最后一条 */
        let is_level_last = false;
        for (let i = 0; i < step_map.length; i++) {
            const _level_num = step_map[i];
            sum += _level_num;
            if (step <= sum - 1) {
                level_index = i;
                level_step_index = step - (sum - _level_num);
                break;
            }
        }

        /** 到达最后一条信息, 完成显示 */
        const level_num = step_map[level_index];
        if (
            level_index >= step_map.length - 1 &&
            level_step_index >= level_num - 1
        ) {
            is_last = true;
        }
        /** 下一条信息中间要停留时间1秒 */
        if (level_step_index >= level_num - 1) {
            is_level_last = true;
        }
        return {
            level_index,
            level_step_index,
            is_level_last,
            is_last,
        };
    }
    private showTip(step?: number) {
        const { tip_msg } = this;

        step = step || 0;

        this.step = step;
        const {
            level_index,
            level_step_index,
            is_last,
            is_level_last,
        } = this.getStepInfo(step);

        const { html_div } = this.view;
        /** 单个文字显示的时间间隔  */
        let space = 70;
        /** 显示所有文字之后 再显示一段时间 */
        const level_wait_time = 1000;

        const tip_item = tip_msg[level_index];
        html_div.innerHTML = this.getTipByLen(tip_item, level_step_index + 1);

        clearTimeout(this.timeout);
        /** 到达最后一条信息, 完成显示 */
        if (is_last) {
            this.timeout = setTimeout(
                () => {
                    this.complete();
                },
                this.auto_hide ? level_wait_time : 0,
            ) as any;
            return;
        }

        /** 下一条信息中间要停留时间1秒 */
        if (is_level_last) {
            space = level_wait_time;
        }
        this.timeout = setTimeout(() => {
            this.showTip(++step);
        }, space) as any;
    }

    /** 获取指定长度的tip */
    private getTipByLen(tip: TipItem, len: number) {
        const result = [] as TipJsonItem[];
        const { style } = this;
        /** 字符串直接截取 */
        if (typeof tip === 'string') {
            const [msg_arr] = spliceStr(tip, len);
            for (const msg of msg_arr) {
                result.push({ ...style, msg });
            }
        } else {
            /** [{color: .., msg:...}, ...]截取数组item+最后一个item中截取字符 */
            for (const item of tip) {
                // tslint:disable-next-line: prefer-const
                let { msg, ...props } = item;
                const [msg_arr, new_len] = spliceStr(msg, len);
                len = new_len;
                props = {
                    ...style,
                    ...props,
                };
                for (const msg_item of msg_arr) {
                    result.push({ ...props, msg: msg_item });
                }
                if (len <= 0) {
                    break;
                }
            }
        }

        const result_html = this.jsonToHtml(result);
        console.log(`test:>`, result_html);
        return result_html;
    }
    /** 将提示的信息json转化为html */
    private jsonToHtml(tip_data: TipJsonItem[]) {
        /** 拼接字符的模版 */
        let html = '';
        for (const tip_item of tip_data) {
            /** 当个item生成的span */
            let html_item = default_tpl;
            for (const key in tip_item) {
                if (!tip_item.hasOwnProperty(key)) {
                    continue;
                }
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
    public show(dir: PromptPos) {
        let ani_fun: Func<void>;
        switch (dir) {
            case 'top':
                ani_fun = slide_down_in;
                break;
            case 'right':
                ani_fun = slide_left_in;
                break;
            case 'bottom':
                ani_fun = slide_up_in;
                break;
            case 'left':
            default:
                ani_fun = slide_right_in;
                break;
        }
        ani_fun(this.view, 800);
    }
    /**分析提示信息, 将提示信息变成[12,30,..]这种形式
     * step不停的累加 12 + 30 + ...
     * 如果中间有突然显示完整信息将清空原来的所有timeOut直接显示完整信息
     */
    private analysisTip(tip_msg: TipItem[]) {
        const step_map = [] as number[];

        for (const tip_item of tip_msg) {
            let len = tip_item.length;
            /** 计算单个[{color: .., msg:...}, ...]里面字符个数 */
            if (typeof tip_item !== 'string') {
                len = 0;
                for (const item of tip_item) {
                    len += item.msg.length;
                }
            }
            step_map.push(len);
        }
        return step_map;
    }
    /** 触发显示完整信息 */
    public showCompletedTip() {
        if (!this.is_going) {
            return;
        }
        /** 清除现在所有正在进行的倒计时 */
        clearTimeout(this.timeout);
        const step_info = this.getCurTipCompleteStepInfo();

        /** 已经显示所有信息直接显示所有信息 */
        if (step_info.is_complete) {
            this.complete();
            return;
        }
        /** 正在显示完整信息, 直接显示下一条 */
        if (step_info.in_wait) {
            this.showTip(++step_info.step);
            return;
        }
        /** 显示当前信息的完整信息 */
        this.showTip(step_info.step);
    }
    /** 获取当前提示信息的信息 */
    private getCurTipCompleteStepInfo(): CompleteStepInfo {
        let step = this.step;
        const step_map = this.step_map;

        let step_t = 0;
        let in_wait = false;
        let is_complete = false;
        for (let i = 0, len = step_map.length; i < len; i++) {
            step_t += step_map[i];
            if (step < step_t) {
                step = step_t;
                break;
            }
            /** step == step_t是已经显示完整信息, 等待下一条信息 */
            if (step === step_t) {
                in_wait = true;
                /** 如果是最后一条信息等待就是到了最后一条.. */
                if (i === len - 1) {
                    is_complete = true;
                }
                break;
            }
        }
        return {
            step,
            in_wait,
            is_complete,
        };
    }
    /** 显示结束,最终结果 */
    private complete() {
        if (this.complete_resolve) {
            callFunc(this.complete_resolve);
        }
        if (this.auto_hide) {
            this.hide();
        }
        this.reset();
    }

    public getSize() {
        const { view } = this;
        const { width, height } = view;
        return { width, height };
    }

    /** 重置 */
    private reset() {
        this.tip_msg = null;
        this.complete_resolve = null;
        this.auto_hide = true;
        this.step = -1;
        this.step_map = null;
        this.is_going = false;
        Laya.stage.offAllCaller(this);
    }
    public hide() {
        const { view } = this;
        view.html_div.innerHTML = '';
        view.visible = false;
    }
}

function spliceStr(str: string, len: number) {
    const str_arr = str.split('<br/>');
    const result: string[] = [];
    if (DataTransferItem.length === 1) {
        result.push(str.slice(0, len));
        len = 0;
    } else {
        for (let i = 0; i < str_arr.length; i++) {
            const item = str_arr[i];
            len = len - item.length;
            const item_str = len > 0 ? item : item.slice(0, item.length + len);
            result.push(item_str);
            if (i !== str_arr.length - 1 && len > 0) {
                console.log(i, str_arr.length - 1);
                result.push('<br/>');
                len--;
            }
            if (len <= 0) {
                break;
            }
        }
    }

    return [result, len] as [string[], number];
}

(window as any).spliceStr = spliceStr;
