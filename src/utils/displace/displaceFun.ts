import { FUNCTION } from './function';
import { Displace, Line, CurveInfo, t_fish_displace_pos } from './displace';
import { getLineOutPoint } from '../utils';

export type t_displace_fun_info = {
    funNo: string;
    funParam: any[];
    radio?: number;
    len?: number;
    /** poker水母直接出现在屏幕中间无需添加额外曲线 */
    no_enter_leave?: boolean;
    /** poseidon椭圆进入页面需要额外添加直线 */
    enter?: boolean;
    /** poseidon椭圆离开页面需要额外添加直线 */
    leave?: boolean;
};

type AddLineType = 'start' | 'end';

/** 位移控制函数 */
export class DisplaceFun extends Displace {
    constructor(
        fun_list: t_displace_fun_info[],
        fish_type: string,
        total_time: number,
        used_time: number,
    ) {
        super(fish_type, total_time, used_time);
        this.initFun(fun_list);
    }
    private initFun(fun_list: t_displace_fun_info[]) {
        let all_length = 0;
        const curves = [] as CurveInfo[];
        let debug = false;
        for (let i = 0; i < fun_list.length; i++) {
            let curve_item = {} as CurveInfo;
            let fun_no = fun_list[i].funNo;
            let fun_param = fun_list[i].funParam;
            /** 直接显示在页面中的鱼不需要添加额外路线 */
            let enter = fun_list[i].enter;
            let no_enter_leave = fun_list[i].no_enter_leave;
            let leave = fun_list[i].no_enter_leave || fun_list[i].leave;
            let curve = FUNCTION[fun_no].apply(this, fun_param);
            curve_item.curve = curve;
            let length = fun_list[i].len;
            if (!length && typeof curve.length == 'function') {
                length = curve.length(1);
            }
            curve_item.length = length || 1;
            all_length += curve_item.length;

            // 在曲线的前面添加一个直线, 用于鱼游入
            if (i == 0) {
                /**poker赛鱼直接在屏幕中间显示 不需要额外创建边界用于进入直线 */
                if (!no_enter_leave) {
                    let curve_before = this.createSpace(
                        'before',
                        curve.get(0),
                        curve.derivative(0),
                    ) as CurveInfo;
                    curves.unshift(curve_before);
                    all_length += curve_before.length;
                }
            }

            curves.push(curve_item);

            if (i == fun_list.length - 1) {
                /**添加额外的离开曲线 */
                if (leave) {
                    let offset_curve_info = this.createOffsetLine(
                        curve_item,
                        'end',
                    );
                    curves.push(offset_curve_info);
                    all_length += offset_curve_info.length;

                    curve = offset_curve_info.curve;
                }
                /**离开屏幕为鱼大小添加新的路径  */
                let curve_after = this.createSpace(
                    'after',
                    curve.get(1),
                    curve.derivative(1),
                ) as CurveInfo;
                curves.push(curve_after);
                all_length += curve_after.length;
            }
        }

        let cur_length = 0;
        for (let i = 0; i < curves.length; i++) {
            let curve = curves[i];
            cur_length += curve.length;
            curve.radio = cur_length / all_length;
        }

        this.curve_list = curves;
    }
    /**创建额外的 进入路线 离开路线 */
    createOffsetLine(curve_info: CurveInfo, type: AddLineType) {
        let cur_len = curve_info.length;

        let p_radio = 0;
        if (type == 'end') {
            p_radio = 1;
        }
        /* 开始点坐标 -- 原曲线结束坐标*/
        let start_p = curve_info.curve.get(p_radio);
        /* 结束点方向 -- 原曲线结束方向*/
        let derivative_p = curve_info.curve.derivative(p_radio);
        let derivative = new SAT.Vector(derivative_p.x, derivative_p.y);
        if (type == 'start') {
            derivative = derivative.reverse();
        }
        let end_p = getLineOutPoint(start_p, derivative);

        let leave_line = new Line(end_p, start_p);
        if (type == 'end') {
            leave_line = new Line(start_p, end_p);
        }
        return {
            curve: leave_line,
            length: leave_line.length(),
        };
    }
    update(update_frame: number): t_fish_displace_pos {
        let used_frame = (this.used_frame = this.used_frame + update_frame);
        let is_complete = false;

        let used_radio = used_frame / this.total_frame;

        if (used_radio <= 0) {
            return {
                not_enter: true,
            };
        }

        if (used_radio >= 1) {
            is_complete = true;
            return {
                is_complete: is_complete,
            };
        }
        let point_info = this.getPointAtRadio(used_radio);
        let position = point_info.position;
        let direction = point_info.direction;

        return {
            is_complete: is_complete,
            position: new laya.maths.Point(position.x, position.y),
            direction: new SAT.Vector(direction.x, direction.y),
        };
    }
}
