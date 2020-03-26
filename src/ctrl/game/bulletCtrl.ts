import { BulletEvent, BulletModel } from 'model/game/gun/bulletModel';
import { vectorToDegree } from 'utils/mathUtils';
import { NetModel } from 'model/game/gun/netModel';
import { NetCtrl } from './netCtrl';
import { ModelEvent } from 'model/modelEvent';
import { addNet } from 'view/viewState';
import { playSkeleton } from 'utils/utils';
import { Skeleton } from 'laya/ani/bone/Skeleton';

/** 子弹的控制器 */
export class BulletCtrl {
    /**
     * @param view 玩家对应的动画
     * @param model 玩家对应的model
     */
    constructor(private view: Skeleton, private model: BulletModel) {
        this.init();
    }
    private init() {
        this.initView();
        this.initEvent();
    }
    private initView() {
        const { view, model } = this;
        const { skin_level } = model;
        this.syncPos();
        view.visible = true;
        view.scale(0.8, 0.8);
        playSkeleton(view, getBulletAniSkin(skin_level), true);
        // playSkeleton(view, skin_level, true);
    }
    private initEvent() {
        const { view } = this;
        const { event } = this.model;

        event.on(BulletEvent.Move, this.syncPos);
        event.on(BulletEvent.AddNet, (net_model: NetModel) => {
            const net_view = addNet(net_model.skin) as Skeleton;
            const net_ctrl = new NetCtrl(net_view, net_model);
        });
        event.on(ModelEvent.Destroy, () => {
            view.destroy();
        });
    }
    private syncPos = () => {
        const { view } = this;
        const { pos, velocity } = this.model;

        const angle = vectorToDegree(velocity) + 90;
        view.rotation = angle;
        view.pos(pos.x, pos.y);
    }; // tslint:disable-line
    private rage = () => {
        const { view } = this;
        const { pos, velocity } = this.model;

        const angle = vectorToDegree(velocity) + 90;
        view.rotation = angle;
        view.pos(pos.x, pos.y);
    }; // tslint:disable-line
}

function getBulletAniSkin(skin_level: string) {
    const num_skin = Number(skin_level);
    if (num_skin > 3) {
        return 0;
    } else {
        return skin_level;
    }
}
