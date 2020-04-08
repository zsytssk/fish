import { viewState } from 'view/viewState';
import { createSprite } from 'utils/dataUtil';
import { move, slide_up_in, sleep } from 'utils/animate';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Laya } from 'Laya';
import { Event } from 'laya/events/Event';
import { Label } from 'laya/ui/Label';

const award_coin_num = 8;
const space_row = 10;
const space_column = 10;
const coin_width = 70;
const coin_height = 70;
const coin_show_time = 0.5;
const coin_stop_time = 0.5;
const coin_fly_time = 0.5;

/** 显示奖励金币 */
export async function showAwardCoin(
    pos: Point,
    end_pos: Point,
    num: number,
    is_cur_player: boolean,
) {
    const { coins, pos: new_pos } = createAwardCoin(pos, num);
    sleep(coin_show_time).then(() => {
        showAwardNum(new_pos, num, is_cur_player);
    });
    await animateCoin(coins, end_pos);
}

/** 显示奖励金币 */
export function createAwardCoin(pos: Point, num: number) {
    const { ani_overlay } = viewState;
    const coin_num =
        num / award_coin_num >= 8 ? 8 : Math.ceil(num / award_coin_num);
    const num_row = coin_num > 4 ? 2 : 1;
    const num_column = Math.ceil(coin_num / num_row);

    const coins = [];
    const coins_width =
        (num_column - 1) * space_column + num_column * coin_width;
    const coins_height = (num_row - 1) * space_row + num_row * coin_height;

    pos = calcCoinRange(pos, coins_width, coins_height);

    for (let i = 0; i < num_column; i++) {
        for (let j = 0; j < num_row; j++) {
            const coin_view = createCoinAni() as Skeleton;
            coin_view.visible = false;
            ani_overlay.addChild(coin_view);
            const x =
                pos.x +
                ((coin_width + space_column) * (2 * i + 1 - num_column)) / 2;
            const y =
                pos.y + ((coin_height + space_row) * (2 * j + 1 - num_row)) / 2;
            coin_view.play(0, true);
            coin_view.pos(x, y);
            coins.push(coin_view);
        }
    }
    return { coins, pos };
}

/** 显示奖励的数目 */
export function showAwardNum(pos: Point, num: number, is_cur_player: boolean) {
    const { ani_overlay } = viewState;
    const { upside_down } = viewState.game;
    const bg_ani = createSprite('other', 'award_light') as Skeleton;
    const num_label = new Label();

    bg_ani.zOrder = 5;
    num_label.zOrder = 10;
    num_label.font = is_cur_player ? 'numYellow40' : 'numWhite40';
    num_label.text = '+' + num;
    if (upside_down) {
        num_label.scaleY = -1;
    }
    ani_overlay.addChild(num_label);
    ani_overlay.addChild(bg_ani);
    const bounds_num_label = num_label.getBounds();
    num_label.pivot(bounds_num_label.width / 2, bounds_num_label.height / 2);
    num_label.pos(pos.x, pos.y);
    bg_ani.pos(pos.x, pos.y);
    bg_ani.once(Event.STOPPED, bg_ani, () => {
        num_label.destroy();
        bg_ani.destroy();
    });
    bg_ani.play(0, false);
}

/** 计算金币的边界... */
function calcCoinRange(pos: Point, coins_width: number, coins_height: number) {
    let { x, y } = pos;
    const { ani_overlay } = viewState;
    const stage_width = Laya.stage.width;
    const stage_height = Laya.stage.height;

    const start = (ani_overlay.width - stage_width) / 2;
    const end_pos = stage_width + (ani_overlay.width - stage_width) / 2;

    if (x - coins_width / 2 < start) {
        /* 左边界 */
        x = start + coins_width / 2;
    } else if (x - coins_width / 2 > end_pos) {
        /* 右边界 */
        x = end_pos - coins_width / 2;
    }

    if (y - coins_height / 2 < 0) {
        /* 上边界 */
        y = coins_height / 2;
    } else if (y - coins_height / 2 > stage_height) {
        /* 下边界 */
        y = stage_height - coins_height / 2;
    }
    return {
        x,
        y,
    };
}

/** 金币飞行动画... */
function animateCoin(coin_views: Skeleton[], end_pos: Point) {
    coin_views.reverse().forEach(async (coin_view, i) => {
        const start_pos = {
            x: coin_view.x,
            y: coin_view.y,
        };
        /** 100显示显示展示200, */
        await slide_up_in(coin_view, coin_show_time * 1000);
        await sleep(coin_stop_time + i * 0.2);
        await move(coin_view, start_pos, end_pos, coin_fly_time * 1000);
        coin_view.removeSelf();
        pool.push(coin_view);
    });
}

const pool = [] as Skeleton[];
function createCoinAni() {
    let item = pool.pop();
    if (!item || item.destroyed) {
        item = createSprite('other', 'coin') as Skeleton;
    }
    const { upside_down } = viewState.game;
    if (upside_down) {
        item.scaleY = -1;
    }
    return item;
}
