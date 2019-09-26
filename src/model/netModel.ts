import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { BodyCom } from './com/bodyCom';
import { getShapes } from './com/bodyComUtil';
import { FishModel } from './fishModel';
import { ModelEvent } from './modelEvent';

/** 鱼网数据类 */
export class NetModel extends ComponentManager {
    /** 炮口的方向 */
    private cast_fish_list: FishModel[] = [];
    /** 位置 */
    private pos: Point;
    /** 炮等级 */
    public readonly level: number;
    /** 炮皮肤 */
    public readonly skin: number;
    constructor(pos: Point, cast_fish: FishModel, level: number, skin: number) {
        super();

        this.level = level;
        this.skin = skin;
        this.pos = pos;
        this.cast_fish_list.push(cast_fish);
        this.init();
    }
    private init() {
        const { level } = this;
        const shapes = getShapes('net', level);
        const body_com = new BodyCom(shapes);
        body_com.update(this.pos);
        this.addCom(new EventCom(), body_com);
    }
    public get body() {
        return this.getCom(BodyCom);
    }
    public get event() {
        return this.getCom(EventCom);
    }
    public destroy() {
        this.event.emit(ModelEvent.Destroy);
        super.destroy();
    }
}
