import { createSprite } from 'utils/dataUtil';
import { playSkeleton } from 'utils/utils';
import { viewState } from 'view/viewState';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { getLang } from 'ctrl/hall/hallCtrlUtil';
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
    const { ani_wrap } = viewState;
    const { upside_down } = viewState.game;
    if (!pop_tip_ani || pop_tip_ani.destroyed) {
        pop_tip_ani = createAni('pos_tip');
    }
    if (!pop_tip_ani.parent) {
        ani_wrap.addChild(pop_tip_ani);
    }
    if (upside_down) {
        pop_tip_ani.scaleX = -1;
    }
    playSkeleton(pop_tip_ani, lang, true);
}
