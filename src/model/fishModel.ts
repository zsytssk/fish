import { DisplaceInfo, Displace, CurveInfo } from 'utils/displace/displace';
import { MoveDisplaceCom } from './com/moveCom/moveDisplaceCom';
import { EventCom } from 'comMan/eventCom';
import { ComponentManager } from 'comMan/component';
import { GameModel } from './gameModel';
import {
    createCurvesByPath,
    createCurvesByFun,
} from 'utils/displace/displaceUtil';
import { getShapes } from './com/bodyComUtil';
import { BodyCom } from './com/bodyCom';
import { ModelEvent } from './modelEvent';

export const FishEvent = {
    move: 'move',
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
    /** 鱼的状态 */
    private game: GameModel;
    constructor(data: ServerFishInfo, game: GameModel) {
        super();

        this.game = game;
        this.init(data);
    }
    public get event() {
        return this.getCom(EventCom);
    }
    public get body() {
        return this.getCom(BodyCom);
    }
    private init(data: ServerFishInfo) {
        const { typeId, fishId } = data;
        this.type = typeId;
        this.id = fishId;

        const displace = createFishDisplace(data);
        const move_com = new MoveDisplaceCom(displace, this.onMoveChange);
        const shapes = getShapes('fish', Number(typeId));
        const body_com = new BodyCom(shapes);

        this.addCom(new EventCom(), move_com, body_com);
    }
    private onMoveChange = (displace_info: DisplaceInfo) => {
        const body_com = this.getCom(BodyCom);
        const { pos, direction, is_complete, out_stage } = displace_info;
        if (is_complete) {
            return this.destroy();
        }
        if (out_stage) {
            return;
        }
        body_com.update(pos, direction);

        this.event.emit(FishEvent.move, {
            pos,
            direction,
        });
    }; // tslint:disable-line: semicolon
    public destroy() {
        this.game.removeFish(this);
        this.event.emit(ModelEvent.Destroy);
        super.destroy();
    }
}

function createFishDisplace(data: ServerFishInfo) {
    const {
        typeId,
        displaceType,
        pathNo,
        usedTime,
        totalTime,
        reverse,
        funList,
    } = data;

    let curve_list: CurveInfo[];
    if (displaceType === 'path') {
        curve_list = createCurvesByPath(pathNo, typeId);
    } else if (displaceType === 'fun') {
        curve_list = createCurvesByFun(funList, typeId);
    }
    return new Displace(totalTime, usedTime, curve_list, reverse);
}
