import { BulletEvent, BulletModel } from 'model/game/gun/bulletModel';
import { vectorToDegree } from 'utils/mathUtils';
import { NetModel } from 'model/game/gun/netModel';
import { NetCtrl } from './netCtrl';
import { ModelEvent } from 'model/modelEvent';
import { addNet } from 'view/viewState';
import { playSkeleton } from 'utils/utils';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { recoverSkeletonPool } from 'view/viewStateUtils';

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
        view.zOrder = 301;
    }
    private initEvent() {
        const { event } = this.model;

        event.on(BulletEvent.Move, this.syncPos, this);
        event.on(
            BulletEvent.AddNet,
            (net_model: NetModel) => {
                const net_view = addNet(net_model.skin) as Skeleton;
                const net_ctrl = new NetCtrl(net_view, net_model);
            },
            this,
        );
        event.on(
            ModelEvent.Destroy,
            () => {
                this.destroy();
            },
            this,
        );
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
    public destroy() {
        recoverSkeletonPool('bullet', this.model.skin, this.view);
        this.model?.event?.offAllCaller(this);
        this.model = undefined;
    }
}

function getBulletAniSkin(skin_level: string) {
    const num_skin = Number(skin_level);
    if (num_skin > 3) {
        return 0;
    } else {
        return skin_level;
    }
}
