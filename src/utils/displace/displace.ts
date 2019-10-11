import * as SAT from 'sat';
import { Line } from './line';
import { stage_width, stage_height, timeToFrame } from './displaceUtil';
import { getSpriteInfo, getShapeInfo } from 'utils/dataUtil';

export type Curve = {
    get(t: number): Point;
    derivative(t: number): Point;
    length?(t?: number): number;
    is_static?: boolean;
};

export type CurveInfo = {
    curve: Curve;
    length: number;
    radio?: number;
    radio_len?: number;
};
/** 当前曲线信息 */
export type CurCurveInfo = {
    /** 当前curve在所有curve_list中的index */
    index: number;
    /** 当前curve在所有curve_list中的radio */
    start_radio: number;
    end_radio: number;
    /** 当前curve */
    curve: CurveInfo;
    /** 当前radio在当前中curve中的radio */
    radio_in_curve: number;
};
export type DisplaceInfo = {
    pos?: Point;
    velocity?: SAT.Vector;
    out_stage?: boolean;
    is_complete?: boolean;
};
/**
 * 位移控制器
 */
export class Displace {
    /** 使用的时间 */
    protected curve_list: CurveInfo[] = [];
    protected used_frame: number;
    /** 总共的时间 */
    protected total_frame: number;
    /** 鱼的类型 用来获取鱼的长度 */
    protected fish_type: string;
    /** 当前曲线信息 */
    protected cur_curve_info = {} as CurCurveInfo;
    /** 是否反转 */
    private is_reverse: boolean = false;
    /**
     * 获取鱼的路径
     * @param path_id 鱼的路径
     * @param total_time total_time 鱼总共游多长时间
     * @param used_time 鱼已经游了多长时间
     */
    constructor(
        total_time: number,
        used_time: number,
        curve_list: CurveInfo[],
        reverse?: boolean,
    ) {
        this.total_frame = timeToFrame(total_time);
        this.used_frame = timeToFrame(used_time);
        this.curve_list = curve_list;
        this.is_reverse = reverse;
    }
    public getDisplaceRadio() {
        return this.used_frame / this.total_frame;
    }
    /**
     * 更新path的时间, 通过这个计算现在的位置
     * @param update_frame 更新的帧数
     */
    public update(update_frame: number): DisplaceInfo {
        const used_frame = (this.used_frame = this.used_frame + update_frame);
        let used_radio = used_frame / this.total_frame;
        let is_complete: boolean = false;
        if (used_radio <= 0) {
            return {
                out_stage: true,
            };
        }

        if (used_radio >= 1) {
            is_complete = true;
            return {
                is_complete,
            };
        }

        if (this.is_reverse) {
            used_radio = 1 - used_radio;
        }

        const point_info = this.getPointAtRadio(used_radio);
        const position = point_info.position;
        let velocity = point_info.direction;
        if (this.is_reverse) {
            velocity = velocity.reverse();
        }

        return {
            pos: position,
            velocity,
            is_complete,
        };
    }
    protected getPointAtRadio(
        radio: number,
    ): { position: Point; direction: SAT.Vector } {
        const cur_curve_info = this.calcCurCurveInfo(radio);
        const cur_curve = cur_curve_info.curve;
        const cur_radio = cur_curve_info.radio_in_curve;
        const cur_idx = cur_curve_info.index;

        const position = cur_curve.curve.get(cur_radio);
        let direction = cur_curve.curve.derivative(cur_radio);

        /** 如果此时为静止的那么他的方向为前一条路径终点的方向 */
        if ((cur_curve.curve as Line).is_static) {
            let other_fun;
            let other_radio;
            const curve_list = this.curve_list;
            /** prev fun */
            if (cur_idx - 1 >= 0) {
                other_fun = curve_list[cur_idx - 1].curve;
                other_radio = 1;
            } else {
                other_fun = curve_list[cur_idx + 1].curve;
                other_radio = 0;
            }
            direction = other_fun.derivative(other_radio);
        }
        return {
            position: new Laya.Point(position.x, position.y),
            direction: new SAT.Vector(direction.x, direction.y),
        };
    }
    /** 通过radio获取当前曲线信息 */
    protected calcCurCurveInfo(radio: number): CurCurveInfo {
        const { cur_curve_info, curve_list } = this;
        let cur_radio = 0;

        /** 如果当前的radio变化还在一个曲线中 */
        if (cur_curve_info.end_radio && radio < cur_curve_info.end_radio) {
            cur_radio =
                (radio - cur_curve_info.start_radio) /
                (cur_curve_info.end_radio - cur_curve_info.start_radio);
            cur_curve_info.radio_in_curve = cur_radio;
        } else {
            /** 如果进入下一个曲线 */
            let cur_idx = 0;
            let cur_curve: CurveInfo;
            let prev_radio: number;
            let curve: CurveInfo;

            for (let i = 0; i < curve_list.length; i++) {
                curve = curve_list[i];
                if (radio > curve.radio) {
                    continue;
                }
                cur_idx = i;
                cur_curve = curve;
                if (cur_idx === 0) {
                    prev_radio = 0;
                    cur_radio = radio / curve.radio;
                } else {
                    prev_radio = curve_list[i - 1].radio;
                    cur_radio =
                        (radio - prev_radio) / (curve.radio - prev_radio);
                }
                break;
            }
            cur_curve_info.radio_in_curve = cur_radio;
            cur_curve_info.index = cur_idx;
            cur_curve_info.start_radio = prev_radio;
            cur_curve_info.end_radio = curve.radio;
            cur_curve_info.curve = curve;
        }

        return cur_curve_info;
    }
    public getCurCurveInfo() {
        return this.cur_curve_info;
    }
}
