import GameConfig from 'GameConfig';

export const stage_width = GameConfig.width;
export const stage_height = GameConfig.height;
/** 寻找屏幕中一个点的朝着一个方向的直线 离开屏幕的点 */
export function getLineOutPoint(point: Point, derivative: SAT.Vector) {
    /** 结束坐标 */
    let out_p: Point;

    /** x = 0 | 1334 和直线的交点 */
    let x1 = 0;
    let y1: number;
    let dx1: number;
    let dy1: number;
    dx1 = x1 - point.x;
    /** 如果两个 */
    if (dx1 * derivative.x < 0) {
        x1 = GameConfig.width;
        dx1 = x1 - point.x;
    }
    dy1 = (dx1 * derivative.y) / derivative.x;
    y1 = dy1 + point.y;

    const d1 = x1 * x1 + y1 * y1;
    /** y = 0 | 750 和直线的交点 */
    let x2 = 0;
    let y2: number;
    let dx2: number;
    let dy2: number;
    dy2 = y2 - point.y;
    if (dy2 * derivative.y < 0) {
        y2 = GameConfig.height;
        dy2 = y2 - point.y;
    }
    dx2 = (dy2 * derivative.x) / derivative.y;
    x2 = dx2 + point.x;
    const d2 = x2 * x2 + y2 * y2;

    if (d1 < d2) {
        out_p = {
            x: x1,
            y: y1,
        };
    } else {
        out_p = {
            x: x2,
            y: y2,
        };
    }

    return out_p;
}
