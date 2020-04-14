import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from 'data/audioRes';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Event } from 'laya/events/Event';
import { Label } from 'laya/ui/Label';
import { Ease } from 'laya/utils/Ease';
import { completeAni, EaseFn, tweenLoop, tween } from 'utils/animate';
import { viewState } from 'view/viewState';
import { calcPosRange, createAni, tempAni } from './awardCoin';
import { playSkeleton } from 'utils/utils';
import { Sprite } from 'laya/display/Sprite';

const circle_width = 270;
const circle_height = 270;

/** 奖励圆环 */
export async function showAwardCircle(
    pos: Point,
    num: number,
    is_cur_player: boolean,
    e?: any,
    f?: any,
) {
    return new Promise((resolve, reject) => {
        const { ani_overlay } = viewState;
        const circle = createAni('award_circle') as Skeleton;
        const { upside_down } = viewState.game;
        let radio = 1;
        if (upside_down) {
            circle.scaleY = -1;
            radio = -1;
        } else {
            circle.scaleY = 1;
        }

        pos = calcPosRange(pos, circle_width / 2, circle_height / 2);

        AudioCtrl.play(AudioRes.FlySkill);
        const num_label = showAwardNum(pos, num, is_cur_player);
        ani_overlay.addChild(circle);
        playSkeleton(circle, 0, false);
        circle.pos(pos.x, pos.y);
        scale_in(num_label, radio, 700, (t, b, c, d) => {
            return Ease.elasticOut(t, b, c, d, e, f);
        }).then(() => {
            tweenLoop({
                sprite: num_label,
                props_arr: [
                    { rotation: 0 },
                    { rotation: -30 },
                    { rotation: 0 },
                    { rotation: 30 },
                ],
                time: 120,
            });
        });
        circle.once(Event.STOPPED, circle, () => {
            num_label.destroy();
            tempAni('award_circle', circle);
            resolve();
        });
    });
}

export async function scale_in(
    sprite: Sprite,
    radio: number,
    time?: number,
    ease_fn?: EaseFn,
) {
    await completeAni(sprite);
    ease_fn = ease_fn || 'circleIn';
    time = time || 400;
    const start_props = {
        alpha: 0.2,
        scaleX: 0.2,
        scaleY: 0.2 * radio,
        visible: true,
    };
    const end_props = {
        alpha: 1,
        scaleX: 1,
        scaleY: 1 * radio,
    };
    return tween({ sprite, start_props, end_props, time, ease_fn });
}

/** 显示奖励的数目 */
function showAwardNum(pos: Point, num: number, is_cur_player: boolean) {
    const { ani_overlay } = viewState;
    const { upside_down } = viewState.game;
    const num_label = new Label();

    num_label.zOrder = 10;
    num_label.font = is_cur_player ? 'numYellow40' : 'numWhite40';
    num_label.text = '+' + num;

    ani_overlay.addChild(num_label);
    const bounds_num_label = num_label.getBounds();
    num_label.pivot(bounds_num_label.width / 2, bounds_num_label.height / 2);
    num_label.pos(pos.x, pos.y);
    if (upside_down) {
        num_label.scaleY = -1;
    }
    return num_label;
}
