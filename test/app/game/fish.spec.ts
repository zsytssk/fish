import * as SAT from 'sat';
import { Test } from 'testBuilder';
import { BodyCom, Shape, ShapeInfo } from 'model/com/bodyCom';
import { injectProto } from 'honor/utils/tool';
import { clonePolygon } from 'model/com/bodyComUtil';

export const fish_test = new Test('fish', runner => {
    runner.describe('show_shape', () => {
        const sprite_map = new Map() as Map<BodyCom, Laya.Sprite>;
        /** 绘制形状 */
        injectProto(BodyCom, 'update', (obj: BodyCom) => {
            let sprite = sprite_map.get(obj);
            if (!sprite) {
                sprite = new Laya.Sprite();
                Laya.stage.addChild(sprite);
                sprite_map.set(obj, sprite);
                sprite.alpha = 0.5;
            }
            // tslint:disable-next-line
            drawShape(sprite, obj['shapes'], obj['angle']);
        });
        /** 清除 绘制的形状 */
        injectProto(BodyCom, 'destroy', (obj: BodyCom) => {
            const sprite = sprite_map.get(obj);
            if (!sprite) {
                return;
            }
            sprite.destroy();
        });
    });
});

function drawShape(node: Laya.Sprite, shapes: ShapeInfo[], angle: number) {
    node.graphics.clear();
    node.rotation = angle;

    for (const item of shapes) {
        let shape = item.shape;
        const { pos } = item;

        if (shape instanceof SAT.Polygon) {
            shape = rotationShape(shape, angle);
            const points = [];
            const ori_points = (shape as SAT.Polygon).calcPoints;
            for (const p of ori_points) {
                points.push(p.x, p.y);
            }
            node.graphics.drawPoly(pos.x, pos.y, points, 'red');
        } else if (shape instanceof SAT.Circle) {
            node.graphics.drawCircle(pos.x, pos.y, shape.r, 'red');
        }
    }
}
function rotationShape(shape: SAT.Polygon, angle: number) {
    const new_shape = clonePolygon(shape);
    new_shape.setAngle(angle);
    return new_shape;
}
