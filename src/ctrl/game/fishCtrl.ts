import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';
import { FishEvent, FishModel, FishStatus } from 'model/game/fishModel';
import { FishView } from 'view/scenes/game/fishView';

/** 鱼的控制器 */
export class FishCtrl extends ComponentManager {
    /** view是否水平是翻转  */
    private view_horizon_turn = false;
    /**
     * @param view 鱼对应的动画
     * @param model 鱼对应的model
     */
    constructor(private view: FishView, private model: FishModel) {
        super();
        this.init();
    }
    private init() {
        this.addCom(new TimeoutCom());
        this.initEvent();
    }
    private initEvent() {
        const event = this.model.event;
        const { view } = this;
        event.on(FishEvent.Move, this.syncPos);
        event.on(FishEvent.BeCast, () => {
            view.beCastAni();
        });
        event.on(FishEvent.BeCapture, this.beCapture);
        event.on(FishEvent.StatusChange, (status: FishStatus) => {
            if (status === FishStatus.Freezed) {
                view.stopSwimAni();
            } else {
                view.playSwimAni();
            }
        });
        event.on(FishEvent.Destroy, () => {
            this.destroy();
        });
    }
    public syncPos = () => {
        const { view } = this;
        const { pos, velocity, horizon_turn } = this.model;
        view.syncPos(pos, velocity, horizon_turn);
    }; //tslint:disable-line
    public beCapture = (handler: FuncVoid) => {
        // 被网住的逻辑
        setTimeout(() => {
            handler();
        }, 500);
    }; // tslint:disable-line
    public destroy() {
        const { view } = this;
        view.destroy();
        super.destroy();
    }
}
