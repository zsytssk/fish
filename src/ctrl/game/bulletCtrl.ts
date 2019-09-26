import { BulletModel, BulletEvent } from 'model/bulletModel';
import { GunEvent } from 'model/gunModel';
import { DisplaceInfo } from 'utils/displace/displace';
import { vectorToDegree } from 'utils/mathUtils';

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

        event.on(BulletEvent.move, (displace_info: MoveInfo) => {
            const { pos, direction } = displace_info;
            const angle = vectorToDegree(direction) + 90;
            view.rotation = angle;
            view.pos(pos.x, pos.y);
        });
    }
}
