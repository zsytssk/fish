import { ModelEvent } from 'model/modelEvent';
import { NetModel, NetEvent } from 'model/netModel';
import { FishModel } from 'model/fishModel';

/** 子弹的控制器 */
export class NetCtrl {
    /**
     * @param view 玩家对应的动画
     * @param model 玩家对应的model
     */
    constructor(private view: Laya.Image, private model: NetModel) {
        this.init();
    }
    private init() {
        const { view, model } = this;
        const { x, y } = model.pos;
        view.pos(x, y);

        this.initEvent();
    }
    private initEvent() {
        const { view } = this;
        const { event } = this.model;

        event.on(ModelEvent.Destroy, () => {
            setTimeout(() => {
                view.destroy();
            }, 1000);
        });
        event.on(NetEvent.CastFish, (fish_list: FishModel[]) => {
            console.log(fish_list);
        });
    }
}
