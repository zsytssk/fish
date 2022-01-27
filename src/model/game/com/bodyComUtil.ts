import * as SAT from 'sat';

import { BodyCom } from './bodyCom';

/** 检测和其他的bodyCom是否碰撞 */
export function detectCollision(ori_body: BodyCom, detect_body: BodyCom) {
    const { shapes: my_shapes } = ori_body;
    const { shapes: other_shapes } = detect_body;
    for (const my_shape_info of my_shapes) {
        const { shape: my_shape } = my_shape_info;
        for (const other_shape_info of other_shapes) {
            const { shape: other_shape } = other_shape_info;
            const response = new SAT.Response();
            let is_collision = false;
            if (
                my_shape instanceof SAT.Polygon &&
                other_shape instanceof SAT.Polygon
            ) {
                is_collision = SAT.testPolygonPolygon(
                    my_shape,
                    other_shape,
                    response,
                );
            }
            if (
                my_shape instanceof SAT.Circle &&
                other_shape instanceof SAT.Polygon
            ) {
                is_collision = SAT.testCirclePolygon(
                    my_shape,
                    other_shape,
                    response,
                );
            }
            if (
                my_shape instanceof SAT.Polygon &&
                other_shape instanceof SAT.Circle
            ) {
                is_collision = SAT.testCirclePolygon(
                    other_shape,
                    my_shape,
                    response,
                );
            }
            if (
                my_shape instanceof SAT.Circle &&
                other_shape instanceof SAT.Circle
            ) {
                is_collision = SAT.testCircleCircle(
                    other_shape,
                    my_shape,
                    response,
                );
            }
            if (is_collision) {
                return true;
            }
        }
        return false;
    }
}
