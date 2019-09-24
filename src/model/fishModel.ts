import { ComponentManager } from 'comMan/component';

/** 鱼的初始化数据 */
type FishData = {
    path: string;
    type: string;
};
export class FishModel extends ComponentManager {
    /** 唯一标示 */
    public id: string;
    /** 鱼的类型 */
    public type: string;
    /** 位置 */
    public pos: Point;
    /** 方向 */
    public direction: SAT.Vector;
}
