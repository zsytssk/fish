import { DisplaceInfo } from 'utils/displace/displace';
import { MoveCom } from './com/moveCom';
import { EventCom } from 'comMan/eventCom';
import { ComponentManager } from 'comMan/component';
import { DisplacePath } from 'utils/displace/displacePath';
import { GameModel } from './gameModel';

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
        this.addCom(move_com);
    }
    private onDisplaceChange = (displace_info: DisplaceInfo) => {
        const event_com = this.getCom(EventCom);
        const { pos, direction, is_complete, out_stage } = displace_info;
        if (is_complete) {
            return this.destroy();
        }
        if (out_stage) {
            return;
        }

        event_com.emit(FishEvent.move, {
            pos,
            direction,
        });
    }; // tslint:disable-line: semicolon
    public destroy() {
        const event_com = this.getCom(EventCom);
        this.game.removeFish(this);
        super.destroy();

        event_com.emit(FishEvent.destroy);
    }
}

function createFishDisplace(data: ServerFishInfo) {
    const { typeId, displaceType, pathNo, usedTime, totalTime, reverse } = data;

    if (displaceType === 'path') {
        return new DisplacePath(pathNo, typeId, totalTime, usedTime, reverse);
    }
}
