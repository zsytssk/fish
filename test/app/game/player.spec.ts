import { state } from 'ctrl/state';
import { Honor } from 'honor';
import { injectProto } from 'honor/utils/tool';
import { BodyCom, ShapeInfo } from 'model/com/bodyCom';
import { clonePolygon } from 'model/com/bodyComUtil';
import * as SAT from 'sat';
import { Test } from 'testBuilder';
import Game from 'view/scenes/game';

export const fish_test = new Test('fish', runner => {
    let init_show_shape = false;
    runner.describe('show_shape', (...params) => {
        if (!init_show_shape) {
            init_show_shape = true;
            const sprite_map = new Map() as Map<BodyCom, Laya.Sprite>;
            /** 绘制形状 */
            injectProto(BodyCom, 'update', (obj: BodyCom) => {
                let sprite = sprite_map.get(obj);
                if (!sprite) {
                    sprite = new Laya.Sprite();
                    const game_view = Honor.director.runningScene as Game;
                    sprite.zOrder = 10;
                    game_view.pool.addChild(sprite);
                    sprite_map.set(obj, sprite);
                    sprite.alpha = 0.5;
                }
                sprite.graphics.clear();
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
        }

        fish_test.runTest('add_fish', [...params]);
    });

    runner.describe('add_fish', (i: number, j: number, t: number) => {
        i = i || 1;
        j = j || 1;
        t = t || 15;
        const fish_data = {
            fishId: '00' + i,
            typeId: `${i + 1}`,
            displaceType: 'path',
            pathNo: `${j}`,
            totalTime: t,
            usedTime: 0,
        } as ServerFishInfo;
        state.game_model.addFish(fish_data);
    });
});

/** 绘制形状 */
function drawShape(node: Laya.Sprite, shapes: ShapeInfo[], angle: number) {
    node.graphics.clear();

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
