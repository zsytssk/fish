import { NetModel } from 'model/game/gun/netModel';
import { ModelEvent } from 'model/modelEvent';
import { playSkeleton } from 'utils/utils';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { viewState } from 'view/viewState';

/** 网的控制器 */
export class NetCtrl {
    /**
     * @param view 玩家对应的动画
     * @param model 玩家对应的model
     */
    constructor(private view: Skeleton, private model: NetModel) {
        this.init();
    }
    private init() {
        const { view, model } = this;
        const { skin_level } = model;
        const { upside_down } = viewState.game;

        const { x, y } = model.pos;
        view.pos(x, y);
        if (upside_down) {
            view.scaleY = -1;
        }
        playSkeleton(view, skin_level, false);
        this.initEvent();
    }
    private initEvent() {
        const { view } = this;
        const { event } = this.model;

        event.on(ModelEvent.Destroy, () => {
            setTimeout(() => {
                if (!view.destroyed) {
                    view.destroy();
                }
            }, 1000);
        });
    }
}
