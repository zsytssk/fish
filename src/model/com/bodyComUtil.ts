import * as SAT from 'sat';
import { SHAPE, shapeOriInfoItem } from 'data/shape';
import { ShapeInfo } from './bodyCom';

export type ShapeOriType = 'fish' | 'bullet' | 'net';

export function getShapes(type: ShapeOriType, level: number): ShapeInfo[] {
    const result = [] as ShapeInfo[];

    let shape_info: shapeOriInfoItem;
    if (type === 'fish') {
        shape_info = SHAPE.fish[level];
        if (shape_info.as) {
            shape_info = SHAPE.fish[shape_info.as];
        }
    } else if (type === 'bullet') {
        shape_info = SHAPE.bullet;
    } else {
        shape_info = SHAPE.net;
    }

    const { shape_direction, shape_list } = shape_info;
    if (shape_direction) {
        this.body_direction = shape_direction;
    }

    if (
        shape_direction === 'turn' ||
        shape_direction === 'fix' ||
        shape_direction === 'upsidedown'
    ) {
        this.rotate_offset = -Math.PI / 2;
    }

    if (shape_info.fix_direction) {
        this.fix_direction = true;
    }

    for (const shape_item of shape_list) {
        const result_item = {} as ShapeInfo;
        const pos = shape_item.position || { x: 0, y: 0 };
        if (shape_item.type === 'Circle') {
            // 圆
            result_item.shape = new SAT.Circle(
                new SAT.Vector(0, 0),
                shape_item.radius,
            );
            if (pos) {
                result_item.pos = new SAT.Vector(pos.x, pos.y);
            }
        } else if (shape_item.type === 'Box') {
            // 是简单的矩形
            const shape_box = new SAT.Box(
                new SAT.Vector(0, 0),
                shape_item.width,
                shape_item.height,
            );
            result_item.shape = shape_box.toPolygon();
            /** 如果有shape_item.pivot, 那么形状的中心点就是此位置, 如果没有就是形状的中心点 */
            if (shape_item.pivot) {
                result_item.shape.translate(
                    -shape_item.pivot.x + pos.x,
                    -shape_item.pivot.y + pos.y,
                );
            } else {
                result_item.shape.translate(
                    -shape_item.width / 2 + pos.x,
                    -shape_item.height / 2 + pos.y,
                );
            }
        } else {
            // 多边形
            const points = [];
            const pivot = shape_item.pivot;
            for (let i = 0; i < shape_item.points.length; i += 2) {
                const point_x = shape_item.points[i];
                const point_y = shape_item.points[i + 1];
                points.push(new SAT.Vector(point_x, point_y));
            }
            result_item.shape = new SAT.Polygon(new SAT.Vector(0, 0), points);
            if (pivot) {
                result_item.shape.translate(-pivot.x + pos.x, -pivot.y + pos.y);
            }
        }
        result.push(result_item);
    }

    return result;
}

/** 复制多边形 */
export function clonePolygon(shape: SAT.Polygon) {
    const points: Point[] = shape.points;

    const new_vec_list: SAT.Vector[] = [];
    for (const p of points) {
        new_vec_list.push(new SAT.Vector(p.x, p.y));
    }
    return new SAT.Polygon(new_vec_list[0], new_vec_list);
}
