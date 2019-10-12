import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { BodyCom } from './com/bodyCom';
import { getShapes } from './com/bodyComUtil';
import { FishModel } from './fishModel';
import { ModelEvent } from './modelEvent';
import { getCollisionAllFish } from './modelState';
import { TimeoutCom } from 'comMan/timeoutCom';
import { BulletModel } from './bulletModel';
import { PlayerModel } from './playerModel';

export const NetEvent = {
    CastFish: 'cast_fish',
};
/** 鱼网数据类 */
export class NetModel extends ComponentManager {
    /** 炮口的方向 */
    private cast_fish: FishModel;
    /** 位置 */
    public readonly pos: Point;
    /** 炮等级 */
    public readonly level: number;
    /** 炮皮肤 */
    public readonly skin: string;
    public player: PlayerModel;
    constructor(pos: Point, cast_fish: FishModel, bullet: BulletModel) {
        super();

        this.level = bullet.level;
        this.skin = bullet.skin;
        this.player = bullet.player;
        this.pos = pos;
        this.cast_fish = cast_fish;
        this.init();
    }
    public get body() {
        return this.getCom(BodyCom);
    }
    public get event() {
        return this.getCom(EventCom);
    }
    private init() {
        const { level, player } = this;
        const shapes = getShapes('net', level);
        const body_com = new BodyCom(shapes);
        body_com.update(this.pos);
        const timeout_com = new TimeoutCom();
        this.addCom(new EventCom(), new TimeoutCom(), body_com);

        if (player.is_cur_player) {
            /** 做成异步, 不然信息 netCtrl 无法接受到 */
            timeout_com.createTimeout(() => {
                const fish_list = getCollisionAllFish(body_com);
                for (const fish of fish_list) {
                    fish.beCast();
                }
                this.event.emit(NetEvent.CastFish, this.cast_fish);
            }, 0);
        }
        timeout_com.createTimeout(() => {
            this.destroy();
        }, 300);
    }
    public destroy() {
        this.event.emit(ModelEvent.Destroy);
        super.destroy();
    }
}
