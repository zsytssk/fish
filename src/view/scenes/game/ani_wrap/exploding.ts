import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Event } from 'laya/events/Event';
import { playSkeleton } from 'utils/utils';
import { viewState } from 'view/viewState';
import { createSkeletonPool, recoverSkeletonPool } from 'view/viewStateUtils';

/** 爆炸的动画 */
function createExplodingAni() {
    const { ani_wrap } = viewState;
    const exploding_ani = createSkeletonPool('other', 'exploding') as Skeleton;
    exploding_ani.scale(2, 2);
    exploding_ani.pos(ani_wrap.width / 2, ani_wrap.height / 2);
    ani_wrap.addChild(exploding_ani);
    exploding_ani.alpha = 0.8;
    return exploding_ani;
}

/** 激活爆炸动画 */
export function activeExploding(pos: Point) {
    const ani = createExplodingAni();

    ani.once(Event.STOPPED, ani, () => {
        recoverSkeletonPool(`other`, 'exploding', ani);
    });
    ani.pos(pos.x, pos.y);
    playSkeleton(ani, 0, false);
}
