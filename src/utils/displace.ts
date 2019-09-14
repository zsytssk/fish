import { CONFIG } from '../data/config';
import { zutil } from '../utils/zutil';
import {
    timeToFrame,
    getSpriteInfo,
    getShapeInfo,
    vectorToAngle,
    frameToTime,
} from './utils';

import { t_displace_fun } from './displaceFunction';
import { t_body_direction } from '../model/core/body';

export type t_curve = Bezier | Line | t_displace_fun;
export type t_curve_info = {
    curve: t_curve;
    length: number;
    radio?: number;
    radio_len?: number;
};
/**当前曲线信息 */
export type CurCurveInfo = {
    /**当前curve在所有curve_list中的index */
    index: number;
    /**当前curve在所有curve_list中的radio */
    start_radio: number;
    end_radio: number;
    /**当前curve */
    curve: t_curve_info;
    /**当前radio在当前中curve中的radio */
    radio_in_curve: number;
};
export type t_fish_displace_pos = {
    position?: t_point;
    direction?: SAT.Vector;
    out_stage?: boolean;
    is_complete?: boolean;
    not_enter?: boolean;
};

type t_path_type = 'curve' | 'line';
/**鱼进入离开的方向, 用来确定加如边距 以sprite-->offset中哪一个为依据*/
type t_start_direction = 'left' | 'right' | 'top' | 'bottom';
/**
 * 位移控制器
 */
export class Displace {
    /**使用的时间*/
    protected curve_list: t_curve_info[] = [];
    protected used_frame: number;
    /**总共的时间*/
    protected total_frame: number;
    /**鱼的类型 用来获取鱼的长度*/
    protected fish_type: string;
    /**当前曲线信息 */
    protected cur_curve_info = {} as CurCurveInfo;
    /**poker赛鱼直接在屏幕中间显示, 做椭圆运动
     * 如果离开就必须创建重新创建一条从离开点切线方程
     */
    private no_enter_leave = false;
    /**
     * 获取鱼的路径
     * @param path_id 鱼的路径
     * @param 11 total_time 鱼总共游多长时间
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
        let start_pos = {
            x: path_info[0],
            y: path_info[1],
        };
        let end_pos = {
            x: path_info[2],
            y: path_info[3],
        };
        let curve = new Line(start_pos, end_pos);
        let curve_info = {} as t_curve_info;
        curve_info.curve = curve;
        curve_info.length = curve.length();
        return curve_info;
    }
    /**鱼游动的路程是 路径的长度+鱼的长度, 路径前后分别添加半个鱼的长度作为进入+离开, 不会突然出现*/
    protected createSpace(
        position: 'before' | 'after',
        start_pos: t_point,
        derivative: t_point,
    ) {
        let sprite_info = getSpriteInfo('fish', this.fish_type);
        let shape_info = getShapeInfo('fish', this.fish_type);
        let shape_direction = shape_info.shape_direction as t_body_direction;

        let fish_len, direction;
        if (
            sprite_info.offset &&
            (shape_direction == 'fix' ||
                shape_direction == 'turn' ||
                shape_direction == 'upsidedown')
        ) {
            let info = this.calcFixLen(position, start_pos);
            fish_len = info.fish_len;
            direction = info.derivative;
        } else {
            fish_len = this.calcNormalLen(position);
            direction = new SAT.Vector(derivative.x, derivative.y).normalize();
            if (position == 'before') {
                direction = direction.reverse();
            }
        }

        let d_len = direction.scale(fish_len, fish_len);
        let end_pos = {
            x: start_pos.x + d_len.x,
            y: start_pos.y + d_len.y,
        };
        let line;
        if (position == 'before') {
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
    /**计算鱼游入游出需要额外加的距离*/
    protected calcNormalLen(position: 'before' | 'after') {
        let fish_len;
        let offset = getSpriteInfo('fish', this.fish_type).offset;

        if (!offset) {
            zutil.logErr("can't find fish sprite offset");
        }
        if (position == 'before') {
            fish_len = offset[0];
        } else {
            fish_len = offset[2];
        }
        return fish_len;
    }
    /**直立行走鱼的边缘路径直接垂直与边框就可以了 */
    protected calcFixLen(position: 'before' | 'after', start_pos: t_point) {
        let sprite_info = getSpriteInfo('fish', this.fish_type);
        let shape_info = getShapeInfo('fish', this.fish_type);
        let shape_direction = shape_info.shape_direction as t_body_direction;

        let fish_len: number;
        let derivative: SAT.Vector;
        if (start_pos.y <= 0) {
            /**上*/
            fish_len = Math.max(sprite_info.offset[0], sprite_info.offset[2]);
            derivative = new SAT.Vector(0, -1);
        } else if (start_pos.x >= CONFIG.stage_width) {
            /*右*/
            fish_len = Math.max(sprite_info.offset[1], sprite_info.offset[3]);
            derivative = new SAT.Vector(1, 0);
        } else if (start_pos.y >= CONFIG.stage_height) {
            /**下*/
            fish_len = Math.max(sprite_info.offset[0], sprite_info.offset[2]);
            derivative = new SAT.Vector(0, 1);
        } else {
            /**左*/
            fish_len = Math.max(sprite_info.offset[1], sprite_info.offset[3]);
            derivative = new SAT.Vector(-1, 0);
        }
        return {
            fish_len,
            derivative,
        };
    }
    public update(update_frame: number): t_fish_displace_pos {
        return {
            is_complete: false,
            position: new laya.maths.Point(0, 0),
            direction: new SAT.Vector(0, 0),
        };
    }
    protected getPointAtRadio(
        radio: number,
    ): { position: t_point; direction: SAT.Vector } {
        let cur_curve_info = this.calcCurCurveInfo(radio);
        let cur_curve = cur_curve_info.curve;
        let cur_radio = cur_curve_info.radio_in_curve;
        let cur_idx = cur_curve_info.index;

        let position = cur_curve.curve.get(cur_radio);
        let direction = cur_curve.curve.derivative(cur_radio);

        /**如果此时为静止的那么他的方向为前一条路径终点的方向*/
        if ((<Line>cur_curve.curve).is_static) {
            let other_fun, other_radio;
            let curve_list = this.curve_list;
            /**prev fun*/
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
            position: new laya.maths.Point(position.x, position.y),
            direction: new SAT.Vector(direction.x, direction.y),
        };
    }
    /**通过radio获取当前曲线信息 */
    protected calcCurCurveInfo(radio: number): CurCurveInfo {
        let cur_curve_info = this.cur_curve_info;
        let cur_radio = 0;

        /**如果当前的radio变化还在一个曲线中 */
        if (cur_curve_info.end_radio && radio < cur_curve_info.end_radio) {
            cur_radio =
                (radio - cur_curve_info.start_radio) /
                (cur_curve_info.end_radio - cur_curve_info.start_radio);
            cur_curve_info.radio_in_curve = cur_radio;
        } else {
            /**如果进入下一个曲线 */
            let cur_idx = 0;
            let cur_curve: t_curve_info;
            let curve_list = this.curve_list;
            let prev_radio: number;
            let curve: t_curve_info;

            for (let i = 0; i < curve_list.length; i++) {
                curve = curve_list[i];
                if (radio > curve.radio) {
                    continue;
                }
                cur_idx = i;
                cur_curve = curve;
                if (cur_idx == 0) {
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

/**直线方程 */
export class Line {
    /**方向*/
    direction: SAT.Vector;
    /**是否是静止*/
    is_static: boolean = false;
    /**长度*/
    len: number;
    start_pos: t_point;
    end_pos: t_point;
    constructor(start_pos: t_point, end_pos: t_point) {
        if (start_pos.x == end_pos.x && start_pos.y == end_pos.y) {
            this.is_static = true;
            this.len = 0;
            this.direction = new SAT.Vector(0, 0);
        }

        let x1 = start_pos.x,
            y1 = start_pos.y,
            x2 = end_pos.x,
            y2 = end_pos.y;
        let dy = y2 - y1;
        let dx = x2 - x1;
        let len = Math.sqrt(dx * dx + dy * dy);

        this.start_pos = start_pos;
        this.end_pos = end_pos;
        this.direction = new SAT.Vector(dx, dy).normalize();
        this.len = len;
    }
    get(t: number) {
        let tlen = t * this.len;
        let tdirection = this.direction.clone().scale(tlen, tlen);
        let x = this.start_pos.x;
        let y = this.start_pos.y;

        return {
            x: x + tdirection.x,
            y: y + tdirection.y,
        };
    }
    derivative(x: number) {
        return this.direction;
    }
    length() {
        return this.len;
    }
}
