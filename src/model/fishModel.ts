import { DisplaceInfo, Displace, CurveInfo } from 'utils/displace/displace';
import { MoveCom } from './com/moveCom';
import { EventCom } from 'comMan/eventCom';
import { ComponentManager } from 'comMan/component';
import { GameModel } from './gameModel';
import {
    createCurvesByPath,
    createCurvesByFun,
} from 'utils/displace/displaceUtil';
import { getShapes } from './com/bodyComUtil';
import { BodyCom } from './com/bodyCom';

export const FishEvent = {
    move: 'move',
    destroy: 'destroy',
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
    private game: GameModel;
    constructor(data: ServerFishInfo, game: GameModel) {
        super();

        this.addCom(new EventCom());
        this.game = game;
        this.init(data);
    }
    public get event() {
        return this.getCom(EventCom);
    }
    private init(data: ServerFishInfo) {
        const { typeId, fishId } = data;
        this.type = typeId;
        this.id = fishId;

        const displace = createFishDisplace(data);
        const move_com = new MoveCom(displace, this.onDisplaceChange);
        const shapes = getShapes('fish', Number(typeId));
        const body_com = new BodyCom(shapes);

        this.addCom(move_com, body_com);
    }
    private onDisplaceChange = (displace_info: DisplaceInfo) => {
        const event_com = this.getCom(EventCom);
        const body_com = this.getCom(BodyCom);
        const { pos, direction, is_complete, out_stage } = displace_info;
        if (is_complete) {
            return this.destroy();
        }
        if (out_stage) {
            return;
        }
        body_com.update(pos, direction);

        event_com.emit(FishEvent.move, {
            pos,
            direction,
        });
    }; // tslint:disable-line: semicolon
    public destroy() {
        const event_com = this.getCom(EventCom);
        this.game.removeFish(this);
        event_com.emit(FishEvent.destroy);
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
