import { FishEvent, FishModel } from 'model/fishModel';
import { vectorToDegree } from 'utils/mathUtils';
import { ModelEvent } from 'model/modelEvent';
import { createRedFilter } from 'utils/utils';
import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';
/** 鱼的控制器 */
export class FishCtrl extends ComponentManager {
    /**
     * @param view 鱼对应的动画
     * @param model 鱼对应的model
     */
    constructor(private view: Laya.Skeleton, private model: FishModel) {
        super();
        this.init();
    }
    private init() {
        const { view } = this;
        view.play(0, true);
        this.addCom(new TimeoutCom());

        this.initEvent();
    }
    private initEvent() {
        const timeout_com = this.getCom(TimeoutCom);
        const event = this.model.event;
        const { view } = this;
        event.on(FishEvent.Move, (displace_info: MoveInfo) => {
            const { pos, direction } = displace_info;
            const angle = vectorToDegree(direction) + 90;
            view.rotation = angle;
            view.pos(pos.x, pos.y);
        });
        event.on(FishEvent.BeCast, () => {
            view.filters = [createRedFilter()];
            timeout_com.createTimeout(() => {
                view.filters = [];
            }, 500);
        });
        event.on(FishEvent.BeCapture, () => {
            this.beCapture();
        });
        event.on(ModelEvent.Destroy, () => {
            this.destroy();
        });
    }
    public beCapture() {}
    public destroy() {
        const { view } = this;
        view.destroy();
        super.destroy();
    }
}
