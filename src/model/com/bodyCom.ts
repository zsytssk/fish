import * as SAT from 'sat';

export type Shape = SAT.Polygon | SAT.Circle;
export type ShapeInfo = {
    /** 形状 */
    shape: Shape;
    /** 每一个形状相对 原点的位置 */
    pos: SAT.Vector;
};

export class BodyCom {
    /** 角度 */
    private angle: number;
    /** 角度 */
    private pos = {} as Point;
    /** 形状信息 */
    private shapes: ShapeInfo[];
    constructor(shapes: ShapeInfo[]) {
        this.shapes = shapes;
    }
    public update(pos: Point, direction?: SAT.Vector) {
        if (direction) {
            this.setAngle(direction);
        }
        this.setPos(pos);
    }
    /** 设置 body 的方向 */
    private setPos(pos: Point) {
        const { x, y } = pos;
        const { x: tx, y: ty } = this.pos;
        if (x === tx && y === ty) {
            return;
        }

        const { shapes } = this;
        for (const shape of shapes) {
            if (shape instanceof SAT.Circle) {
                const { angle } = this;
                const new_pos = shape.pos.clone().rotate(angle);
                shape.pos = new SAT.Vector(x + new_pos.x, y + new_pos.y);
            } else {
                shape.pos = new SAT.Vector(pos.x, pos.y);
            }
        }

        this.pos = { x, y };
    }
    /** 设置 body 的方向 */
    private setAngle(direction: SAT.Vector) {
        let angle = Math.atan2(direction.y, direction.x);
        const shapes = this.shapes;

        angle = angle + Math.PI / 2;
        for (const shape of shapes) {
            if (!(shape instanceof SAT.Polygon)) {
                continue;
            }
            shape.setAngle(angle);
        }
        this.angle = angle;
    }
    /** 检测和其他的bodyCom是否碰撞 */
    public detectCollision(other_body: BodyCom) {
        const { shapes: my_shapes } = this;
        const { shapes: other_shapes } = other_body;
        for (const my_shape of my_shapes) {
            for (const other_shape of other_shapes) {
                const response = new SAT.Response();
                let is_collision: boolean = false;
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
    public destroy() {
        this.shapes = undefined;
    }
}
