import { injectProto } from 'honor/utils/tool';
import { BodyCom, ShapeInfo } from 'model/game/com/bodyCom';
import * as SAT from 'sat';
import { Test } from 'testBuilder';
import GameView from 'view/scenes/game/gameView';
import honor from 'honor';
import { Sprite } from 'laya/display/Sprite';
import { FishView } from 'view/scenes/game/fishView';

export const body_test = new Test('body', runner => {
    let init_show_shape = false;
    runner.describe('show_shape', () => {
        if (!init_show_shape) {
            init_show_shape = true;
            const sprite_map = new Map() as Map<BodyCom, Sprite>;
            /** 绘制形状 */
            injectProto(BodyCom, 'update', (obj: BodyCom) => {
                let sprite = sprite_map.get(obj);
                if (!sprite) {
                    sprite = new Sprite();
                    const game_view = honor.director.runningScene as GameView;
                    sprite.zOrder = 100;
                    game_view.pool.addChild(sprite);
                    sprite_map.set(obj, sprite);
                    sprite.alpha = 0.5;
                }
                sprite.graphics.clear();
                // tslint:disable-next-line
                drawShape(sprite, obj['shapes']);
            });
            /** 清除 绘制的形状 */
            injectProto(BodyCom, 'destroy', (obj: BodyCom) => {
                const sprite = sprite_map.get(obj);
                if (!sprite) {
                    return;
                }
                sprite.destroy();
            });

            injectProto(FishView, 'initAni' as any, (obj: FishView) => {
                obj.graphics.drawRect(0, 0, obj.width, obj.height, '#fff');
            });
        }
    });

    runner.describe('test_sat', () => {
        const a = new SAT.Box(new SAT.Vector(100, 100), 300, 300).toPolygon();
        const b = new SAT.Box(new SAT.Vector(0, 0), 300, 300).toPolygon();
        b.translate(100, 100);
        console.log(`test:>`, a, b);
    });
    runner.describe('test_sat', () => {
        const a = new SAT.Box(new SAT.Vector(100, 100), 300, 300).toPolygon();
        const b = new SAT.Box(new SAT.Vector(0, 0), 300, 300).toPolygon();
        b.translate(100, 100);
        console.log(`test:>`, a, b);
    });
});

/** 绘制形状 */
function drawShape(node: Sprite, shapes: ShapeInfo[]) {
    node.graphics.clear();

    for (const item of shapes) {
        const { shape } = item;
        const { pos } = shape;

        if (shape instanceof SAT.Polygon) {
            const points = [];
            const ori_points = (shape as SAT.Polygon).calcPoints;
            for (const p of ori_points) {
                points.push(p.x, p.y);
            }
            node.graphics.drawPoly(pos.x, pos.y, points, 'green');
        } else if (shape instanceof SAT.Circle) {
            node.graphics.drawCircle(pos.x, pos.y, shape.r, 'green');
        }
    }
}
