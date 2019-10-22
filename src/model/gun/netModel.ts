import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { TimeoutCom } from 'comMan/timeoutCom';
import { BodyCom } from '../com/bodyCom';
import { getShapes } from '../com/bodyComUtil';
import { ModelEvent } from '../modelEvent';
import { BulletModel } from './bulletModel';

export const NetEvent = {
    CastFish: 'cast_fish',
};
/** 鱼网数据类 */
export class NetModel extends ComponentManager {
    /** 位置 */
    public readonly pos: Point;
    /** 炮等级 */
    public readonly level: number;
    /** 炮皮肤 */
    public readonly skin: string;
    /** 炮皮肤 */
    public readonly level_skin: string;
    constructor(pos: Point, bullet: BulletModel) {
        super();

        this.level = bullet.level;
        this.skin = bullet.skin;
        this.level_skin = bullet.level_skin;
        this.pos = pos;
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

        timeout_com.createTimeout(() => {
            this.destroy();
        }, 100);
    }
    public destroy() {
        this.event.emit(ModelEvent.Destroy);
        super.destroy();
    }
}
