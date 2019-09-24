import * as SAT from 'sat';
import { Line } from './line';
import { timeToFrame } from 'utils/mathUtils';
import { stage_width, stage_height } from './displaceUtil';
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
    direction?: SAT.Vector;
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
    /**
     * 获取鱼的路径
     * @param path_id 鱼的路径
     * @param total_time total_time 鱼总共游多长时间
     * @param used_time 鱼已经游了多长时间
     */
    constructor(fish_type: string, total_time: number, used_time: number) {
        this.total_frame = timeToFrame(total_time);
        this.used_frame = timeToFrame(used_time);
        this.fish_type = fish_type;
    }
    public getDisplaceRadio() {
        return this.used_frame / this.total_frame;
    }
    protected createLine(path_info) {
        // 直线
        const start_pos = {
            x: path_info[0],
            y: path_info[1],
        };
        const end_pos = {
            x: path_info[2],
            y: path_info[3],
        };
        const curve = new Line(start_pos, end_pos);
        const curve_info = {} as CurveInfo;
        curve_info.curve = curve;
        curve_info.length = curve.length(1);
        return curve_info;
    }
    /** 鱼游动的路程是 路径的长度+鱼的长度, 路径前后分别添加半个鱼的长度作为进入+离开, 不会突然出现 */
    protected createSpace(
        position: 'before' | 'after',
        start_pos: Point,
        derivative: Point,
    ) {
        const sprite_info = getSpriteInfo('fish', this.fish_type);
        const shape_info = getShapeInfo('fish', this.fish_type);
        const shape_direction = shape_info.shape_direction;

        let fish_len: number;
        let direction: SAT.Vector;
        if (
            sprite_info.offset &&
            (shape_direction === 'fix' ||
                shape_direction === 'turn' ||
                shape_direction === 'upsidedown')
        ) {
            const info = this.calcFixLen(position, start_pos);
            fish_len = info.fish_len;
            direction = info.derivative;
        } else {
            fish_len = this.calcNormalLen(position);
            direction = new SAT.Vector(derivative.x, derivative.y).normalize();
            if (position == 'before') {
                direction = direction.reverse();
            }
        }

        const d_len = direction.scale(fish_len, fish_len);
        const end_pos = {
            x: start_pos.x + d_len.x,
            y: start_pos.y + d_len.y,
        };
        let line;
        if (position === 'before') {
            // 如果在前面添加距离, 起点end_pos为起点加上距离, 终点为起点
            line = new Line(end_pos, start_pos);
        } else {
            // 如果在前面添加距离, 起点为start_pos end_pos为起点加上距离
            line = new Line(start_pos, end_pos);
        }

        return {
            curve: line,
            length: fish_len,
        };
    }
    /** 计算鱼游入游出需要额外加的距离 */
    protected calcNormalLen(position: 'before' | 'after') {
        let fish_len: number;
        const offset = getSpriteInfo('fish', this.fish_type).offset;

        if (!offset) {
            // zutil.logErr("can't find fish sprite offset");
        }
        if (position === 'before') {
            fish_len = offset[0];
        } else {
            fish_len = offset[2];
        }
        return fish_len;
    }
    /** 直立行走鱼的边缘路径直接垂直与边框就可以了 */
    protected calcFixLen(position: 'before' | 'after', start_pos: Point) {
        const sprite_info = getSpriteInfo('fish', this.fish_type);

        let fish_len: number;
        let derivative: SAT.Vector;
        if (start_pos.y <= 0) {
            /** 上 */
            fish_len = Math.max(sprite_info.offset[0], sprite_info.offset[2]);
            derivative = new SAT.Vector(0, -1);
        } else if (start_pos.x >= stage_width) {
            /* 右 */
            fish_len = Math.max(sprite_info.offset[1], sprite_info.offset[3]);
            derivative = new SAT.Vector(1, 0);
        } else if (start_pos.y >= stage_height) {
            /** 下 */
            fish_len = Math.max(sprite_info.offset[0], sprite_info.offset[2]);
            derivative = new SAT.Vector(0, 1);
        } else {
            /** 左 */
            fish_len = Math.max(sprite_info.offset[1], sprite_info.offset[3]);
            derivative = new SAT.Vector(-1, 0);
        }
        return {
            fish_len,
            derivative,
        };
    }
    public update(update_frame: number): DisplaceInfo {
        return {
            is_complete: false,
            pos: new Laya.Point(0, 0),
            direction: new SAT.Vector(0, 0),
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
