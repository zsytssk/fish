/** 移动的类型 路径 | 函数 */
type MoveType = 'path' | 'func';

/** 移动控制component */
export class MoveComponent {
    private type: MoveType;
    /** 更新位置 */
    public onUpdate(pos: Point, direction: SAT.Vector) {}
}
