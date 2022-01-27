import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Sprite } from 'laya/display/Sprite';

import { fade_in, move, stopAni } from '@app/utils/animate';

export type PointerType = 'static' | 'circle' | 'target';

type View = Sprite & {
    pointer_img: Sprite;
    pointer_ani: Skeleton;
};
const TWEEN_TIME = 500;
export class PointerGuide {
    public name = 'pointer';
    /** 用来处理点击其他地方 手指移动到目标点的记录点 */
    private target: Point;
    private view: View;
    constructor(view: View) {
        this.view = view;
    }
    /** 手指移动指向某个点 */
    public moveToTarget(click_p: Point, target_p?: Point) {
        if (target_p) {
            this.target = target_p;
        }
        const { target } = this;
        if (!target) {
            return;
        }
        const { view } = this;

        this.showPointer('static');

        move(view, click_p, target, TWEEN_TIME).then(() => {
            this.showPointer('target');
        });
    }

    public show(pos: Point, type?: PointerType, callback?: FuncVoid) {
        const { view } = this;

        view.visible = false;
        this.showPointer(type);
        view.pos(pos.x, pos.y);

        if (type === 'target') {
            this.target = {
                x: pos.x,
                y: pos.y,
            };
        }

        fade_in(view, TWEEN_TIME).then(callback);
    }
    public isShow() {
        const { view } = this;

        return (view.visible = false);
    }
    private showPointer(type?: PointerType) {
        type = type ? type : 'static';

        const { pointer_img, pointer_ani } = this.view;

        this.resetView();

        if (type === 'static') {
            pointer_img.visible = true;
        } else {
            pointer_ani.visible = true;
            pointer_ani.play(0, true);
        }
    }
    public hidePointer() {
        this.resetView();

        this.target = null;
        this.hide();
    }
    private resetView() {
        const { view } = this;
        const { pointer_img, pointer_ani } = this.view;
        view.alpha = 1;
        pointer_img.visible = false;
        pointer_ani.visible = false;
        pointer_ani.stop();
    }
    /** 隐藏手指 */
    public hide() {
        const { view } = this;
        // fade_out(view);
        stopAni(view);
        view.visible = false;
    }
}
