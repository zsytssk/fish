import { createImg } from 'honor/utils/createSkeleton';
import { FishEvent, FishModel } from 'model/game/fish/fishModel';
import * as SAT from 'sat';
import { createSprite } from 'utils/dataUtil';
import { playSkeleton, stopSkeleton } from 'utils/utils';
import { viewState } from 'view/viewState';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Image } from 'laya/ui/Image';

/** 追踪子弹的动画 */
type AimState = {
    /** 炮台的位置 */
    ori_pos: Point;
    /** 追踪的鱼 */
    fish: FishModel;
    aim_ani_map: Map<string, Skeleton>;
    /** 从当前玩家的炮台到 aim_ani 的点 */
    point_list: Image[];
    /** Point的缓存 */
    points_temp: Image[];
};

const state = {
    point_list: [],
    points_temp: [],
    aim_ani_map: new Map(),
} as AimState;
const point_space = 50;

export function activeAim(pos: Point) {
    const aim_ani = createAim('normal');
    playSkeleton(aim_ani, 0, true);
    aim_ani.pos(pos.x, pos.y);
}

export function activeAimFish(
    fish: FishModel,
    show_points?: boolean,
    ori_pos?: Point,
) {
    const aim_ani = createAim('fish');
    const { fish: ori_fish } = state;
    const { pos } = fish;

    if (ori_fish) {
        ori_fish.event.offAllCaller(aim_ani);
    }
    state.fish = fish;
    state.ori_pos = ori_pos;

    clearPoints();

    if (fish.visible) {
        playSkeleton(aim_ani, 0, true);
        aim_ani.pos(pos.x, pos.y);
    }
    fish.event.on(
        FishEvent.VisibleChange,
        (visible: boolean) => {
            if (visible) {
                playSkeleton(aim_ani, 0, true);
                aim_ani.pos(pos.x, pos.y);
            } else {
                stopSkeleton(aim_ani);
            }
        },
        aim_ani,
    );
    fish.event.on(
        FishEvent.Move,
        (move_info: MoveInfo) => {
            const {
                pos: { x, y },
            } = move_info;
            console.log(`test:>`, x, y);
            aim_ani.pos(x, y);
            if (show_points) {
                createPoints(ori_pos, { x, y });
            }
        },
        aim_ani,
    );
    fish.event.on(FishEvent.Destroy, () => {
        stopAim('fish');
        fish.event.offAllCaller(aim_ani);
    });
}

/** 消除动画 */
export function stopAim(type: string = 'normal') {
    const { aim_ani_map, fish, point_list } = state;
    const aim_ani = aim_ani_map.get(type);

    if (aim_ani) {
        aim_ani.stop();
        aim_ani.removeSelf();
    }

    if (type !== 'fish') {
        return;
    }

    if (point_list.length) {
        state.ori_pos = undefined;
        clearPoints();
    }
    if (fish) {
        fish.event.offAllCaller(aim_ani);
        state.fish = undefined;
    }
}

/** 创建锁定动画 */
function createAim(type: string) {
    const { aim_ani_map } = state;
    const { ani_wrap } = viewState;
    let aim_ani = aim_ani_map.get(type);
    if (!aim_ani) {
        aim_ani = createSprite('other', 'aim') as Skeleton;
        ani_wrap.addChild(aim_ani);
        aim_ani_map.set(type, aim_ani);
    } else if (!aim_ani.parent) {
        ani_wrap.addChild(aim_ani);
    }
    return aim_ani;
}

/** 创建点 */
function createPoints(aim_pos: Point, ori_pos: Point) {
    /** 瞄准路线点之间的距离 */
    const { point_list } = state;
    const { ani_wrap } = viewState;
    /** 瞄准圈的半径 */

    const path = new SAT.Vector(aim_pos.x - ori_pos.x, aim_pos.y - ori_pos.y);
    const len = path.len();
    const path_normal = path.clone().normalize();
    const point_num = Math.ceil(len / point_space);

    handlePointNum(point_num);
    /** 将要显示的点数从开始点开始, 沿着path的方向, 每point_space一个新的点 */
    for (let i = 0; i < point_num; i++) {
        const point = point_list[i];
        const v_pos = path_normal
            .clone()
            .scale(point_space * i, point_space * i);
        const x = ori_pos.x + v_pos.x;
        const y = ori_pos.y + v_pos.y;
        point.x = x;
        point.y = y;
        ani_wrap.addChild(point);
    }
}

/** 通过点的数目来创建|销毁 节点 */
function handlePointNum(point_num: number) {
    const { point_list, points_temp } = state;

    if (point_list.length < point_num) {
        for (let i = point_list.length; i < point_num; i++) {
            const point_view =
                points_temp.pop() || createImg('image/game/aim_point');
            point_list.push(point_view);
            point_view.pivot(point_view.width / 2, point_view.height / 2);
        }
    } else if (point_list.length > point_num) {
        for (let i = point_list.length - 1; i >= point_num; i--) {
            const point = point_list[i];
            point.removeSelf();
            points_temp.push(point);
        }
    }
}

/** 清理 *点* */
function clearPoints() {
    const { point_list, points_temp } = state;
    for (const point of point_list) {
        point.removeSelf();
        points_temp.push(point);
    }
}
