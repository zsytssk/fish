import { getLang } from 'ctrl/hall/hallCtrlUtil';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { playSkeleton } from 'utils/utils';
import { viewState } from 'view/viewState';
import { createAni, tempAni } from './award/awardCoin';

/** 当前用户的位置的动画 */
let pop_tip_ani: Skeleton;
export function activePosTip() {
    createPosTip();
    return pop_tip_ani;
}

export function stopPosTip() {
    if (!pop_tip_ani && pop_tip_ani.destroyed) {
        return;
    }
    tempAni('pos_tip', pop_tip_ani);
}

function createPosTip() {
    const lang = getLang();
    const { ani_overlay } = viewState;
    const { upside_down } = viewState.game;
    if (!pop_tip_ani || pop_tip_ani.destroyed) {
        pop_tip_ani = createAni('pos_tip');
    }
    if (!pop_tip_ani.parent) {
        ani_overlay.addChild(pop_tip_ani);
    }
    pop_tip_ani.scaleX = upside_down ? -1 : 1;
    playSkeleton(pop_tip_ani, lang, true);
}
