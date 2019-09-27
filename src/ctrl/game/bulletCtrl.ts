import { BulletEvent, BulletModel } from 'model/bulletModel';
import { vectorToDegree } from 'utils/mathUtils';
import { NetModel } from 'model/netModel';
import { addNet } from 'ctrl/state';
import { NetCtrl } from './netCtrl';
import { ModelEvent } from 'model/modelEvent';

/** 子弹的控制器 */
export class BulletCtrl {
    /**
     * @param view 玩家对应的动画
     * @param model 玩家对应的model
     */
    constructor(private view: Laya.Image, private model: BulletModel) {
        this.init();
    }
    private init() {
        this.initEvent();
    }
    private initEvent() {
        const { view } = this;
        const { event } = this.model;

        event.on(BulletEvent.Move, (displace_info: MoveInfo) => {
            const { pos, direction } = displace_info;
            const angle = vectorToDegree(direction) + 90;
            view.rotation = angle;
            view.pos(pos.x, pos.y);
        });
        event.on(BulletEvent.AddNet, (net_model: NetModel) => {
            const net_view = addNet(net_model.skin) as Laya.Image;
            const net_ctrl = new NetCtrl(net_view, net_model);
        });
        event.on(ModelEvent.Destroy, () => {
            view.destroy();
        });
    }
}
