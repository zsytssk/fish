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
    public shapes: ShapeInfo[];
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
        for (const shape_info of shapes) {
            const { shape, pos: rel_pos } = shape_info;
            if (shape instanceof SAT.Circle) {
                const { angle } = this;
                const new_pos = rel_pos.clone().rotate(angle);
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
    public destroy() {
        this.shapes = undefined;
    }
}
