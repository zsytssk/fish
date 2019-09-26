import { FishEvent, FishModel } from 'model/fishModel';
import { vectorToDegree } from 'utils/mathUtils';
import { ModelEvent } from 'model/modelEvent';
/** 鱼的控制器 */
export class FishCtrl {
    /**
     * @param view 鱼对应的动画
     * @param model 鱼对应的model
     */
    constructor(private view: Laya.Skeleton, private model: FishModel) {
        this.init();
    }
    private init() {
        const { view } = this;
        view.play(0, true);
        this.initEvent();
    }
    private initEvent() {
        const event = this.model.event;
        const { view } = this;
        event.on(FishEvent.move, (displace_info: MoveInfo) => {
            const { pos, direction } = displace_info;
            const angle = vectorToDegree(direction) + 90;
            view.rotation = angle;
            view.pos(pos.x, pos.y);
        });
        event.on(ModelEvent.Destroy, () => {
            view.destroy();
        });
    }
}
