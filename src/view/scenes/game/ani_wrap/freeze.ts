import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Event } from 'laya/events/Event';

import { createSprite } from '@app/utils/dataUtil';
import { playSkeleton } from '@app/utils/utils';
import { viewState } from '@app/view/viewState';

/** 冰冻的动画 */
let freezing_ani: Skeleton;
function createFreezingAni() {
    const { ani_wrap } = viewState;
    if (!freezing_ani || freezing_ani.destroyed) {
        freezing_ani = createSprite('other', 'freezing') as Skeleton;
        freezing_ani.pos(ani_wrap.width / 2, ani_wrap.height / 2);
        ani_wrap.addChild(freezing_ani);
        freezing_ani.alpha = 0.8;
    } else if (!freezing_ani.parent) {
        ani_wrap.addChild(freezing_ani);
    }
}
export function activeFreeze() {
    createFreezingAni();
    freezing_ani.once(Event.STOPPED, freezing_ani, () => {
        loopFreeze();
    });

    playSkeleton(freezing_ani, 0, false);
}
export function loopFreeze() {
    createFreezingAni();
    playSkeleton(freezing_ani, 1, true);
}
export function stopFreeze() {
    freezing_ani.offAll();
    freezing_ani.stop();
    freezing_ani.removeSelf();
}
