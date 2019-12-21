import { createSprite } from 'utils/dataUtil';
import { viewState } from 'view/viewState';
import { Laya } from 'Laya';
import { Label } from 'laya/ui/Label';
import { Event } from 'laya/events/Event';
import { Skeleton } from 'laya/ani/bone/Skeleton';

const circle_width = 270;
const circle_height = 270;

/** 奖励圆环 */
export async function showAwardCircle(
    pos: Point,
    num: number,
    is_cur_player: boolean,
) {
    return new Promise((resolve, reject) => {
        const { ani_wrap } = viewState;
        const circle = createSprite('other', 'award_big') as Skeleton;
        pos = fixCirclePos(pos);

        const num_label = showAwardNum(pos, num, is_cur_player);
        ani_wrap.addChild(circle);
        circle.play(0, false);
        circle.pos(pos.x, pos.y);
        circle.once(Event.STOPPED, circle, () => {
            num_label.destroy();
            circle.destroy();
            resolve();
        });
    });
}

/** 显示奖励的数目 */
function showAwardNum(pos: Point, num: number, is_cur_player: boolean) {
    const { ani_wrap } = viewState;
    const num_label = new Label();

    num_label.zOrder = 10;
    num_label.font = is_cur_player ? 'numYellow40' : 'numWhite40';
    num_label.text = '+' + num;
    ani_wrap.addChild(num_label);
    const bounds_num_label = num_label.getBounds();
    num_label.pivot(bounds_num_label.width / 2, bounds_num_label.height / 2);
    num_label.pos(pos.x, pos.y);

    return num_label;
}

function fixCirclePos(pos: Point) {
    let { x, y } = pos;
    const stage_width = Laya.stage.width;
    const stage_height = Laya.stage.height;
    const half_width = circle_width / 2;
    const half_height = circle_height / 2;

    if (x - half_width < 0) {
        /* 左边界 */
        x = half_width;
    } else if (x - half_width > stage_width) {
        /* 右边界 */
        x = stage_width - half_width;
    }

    if (y - half_height < 0) {
        /* 上边界 */
        y = half_height;
    } else if (y - half_height > stage_height) {
        /* 下边界 */
        y = stage_height - half_height;
    }
    return {
        x,
        y,
    };
}
