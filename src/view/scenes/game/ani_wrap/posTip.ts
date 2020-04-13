import { createSprite } from 'utils/dataUtil';
import { playSkeleton } from 'utils/utils';
import { viewState } from 'view/viewState';
import { Skeleton } from 'laya/ani/bone/Skeleton';

/** 当前用户的位置的动画 */
let pop_tip_ani: Skeleton;
export function activePosTip() {
    createPosTip();
    playSkeleton(pop_tip_ani, 0, true);
    return pop_tip_ani;
}

export function stopPosTip() {
    if (!pop_tip_ani && pop_tip_ani.destroyed) {
        return;
    }
    pop_tip_ani.stop();
    pop_tip_ani.removeSelf();
}

function createPosTip() {
    const { ani_wrap } = viewState;
    const { upside_down } = viewState.game;
    if (!pop_tip_ani || pop_tip_ani.destroyed) {
        pop_tip_ani = createSprite('other', 'pos_tip') as Skeleton;
    }
    if (upside_down) {
        pop_tip_ani.scaleX = -1;
    }
    if (!pop_tip_ani.parent) {
        ani_wrap.addChild(pop_tip_ani);
    }
}
