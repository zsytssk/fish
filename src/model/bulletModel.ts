import { ComponentManager } from 'comMan/component';

/** 子弹合集数据类, 用来处理一次发射多个子弹 */
export class BulletWrapModel extends ComponentManager {
    /** 等级 */
    public bullet_list: BulletModel[];
}
/** 子弹数据类 */
export class BulletModel extends ComponentManager {
    /** 等级 */
    public level: string;
    /** 位置 */
    public pos: Point;
    /** 方向 */
    public direction: SAT.Vector;
}
