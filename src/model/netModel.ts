import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { BodyCom } from './com/bodyCom';
import { getShapes } from './com/bodyComUtil';
import { FishModel } from './fishModel';
import { ModelEvent } from './modelEvent';
import { getCollisionAllFish } from './modelState';
import { TimeoutCom } from 'comMan/timeoutCom';

export const NetEvent = {
    CastFish: 'cast_fish',
};
/** 鱼网数据类 */
export class NetModel extends ComponentManager {
    /** 炮口的方向 */
    private cast_fish_list: FishModel[] = [];
    /** 位置 */
    public pos: Point;
    /** 炮等级 */
    public readonly level: number;
    /** 炮皮肤 */
    public readonly skin: string;
    constructor(pos: Point, cast_fish: FishModel, level: number, skin: string) {
        super();

        this.level = level;
        this.skin = skin;
        this.pos = pos;
        this.cast_fish_list.push(cast_fish);
        this.init();
    }
    public get body() {
        return this.getCom(BodyCom);
    }
    public get event() {
        return this.getCom(EventCom);
    }
    private init() {
        const { level } = this;
        const shapes = getShapes('net', level);
        const body_com = new BodyCom(shapes);
        body_com.update(this.pos);
        const timeout_com = new TimeoutCom();
        this.addCom(new EventCom(), new TimeoutCom(), body_com);

        const fish_list = getCollisionAllFish(body_com);
        this.event.emit(NetEvent.CastFish, fish_list);
        timeout_com.createTimeout(() => {
            this.destroy();
        }, 300);
    }
    public destroy() {
        this.event.emit(ModelEvent.Destroy);
        super.destroy();
    }
}
