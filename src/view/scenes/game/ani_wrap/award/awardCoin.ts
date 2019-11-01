import { viewState } from 'view/viewState';
import { createSprite } from 'utils/dataUtil';
import { move, slide_up_in, sleep } from 'utils/animate';

const award_coin_num = 8;
const space_row = 10;
const space_column = 10;
const coin_width = 70;
const coin_height = 70;
const coin_show_time = 2;
const coin_stop_time = 1;
const coin_fly_time = 1;

/** 显示奖励金币 */
export function showAwardCoin(pos: Point, end_pos: Point, num: number) {
    const coins = createAwardCoin(pos, num);
    animateCoin(coins, end_pos);
}

/** 显示奖励金币 */
export function createAwardCoin(pos: Point, num: number) {
    const { ani_wrap } = viewState;
    const coin_num =
        num / award_coin_num >= 8 ? 8 : Math.ceil(num / award_coin_num);
    const num_row = coin_num > 4 ? 2 : 1;
    const num_column = Math.ceil(coin_num / num_row);

    const coin_views = [];
    const coins_width =
        (num_column - 1) * space_column + num_column * coin_width;
    const coins_height = (num_row - 1) * space_row + num_row * coin_height;

    pos = calcCoinRange(pos, coins_width, coins_height);

    for (let i = 0; i < num_column; i++) {
        for (let j = 0; j < num_row; j++) {
            const coin_view = createCoinAni() as Laya.Skeleton;
            coin_view.visible = false;
            ani_wrap.addChild(coin_view);
            const x =
                pos.x +
                ((coin_width + space_column) * (2 * i + 1 - num_column)) / 2;
            const y =
                pos.y + ((coin_height + space_row) * (2 * j + 1 - num_row)) / 2;
            coin_view.play(0, true);
            coin_view.pos(x, y);
            coin_views.push(coin_view);
        }
    }
    return coin_views;
}

/** 计算金币的边界... */
function calcCoinRange(pos: Point, coins_width: number, coins_height: number) {
    let { x, y } = pos;
    const stage_width = Laya.stage.width;
    const stage_height = Laya.stage.height;

    if (x - coins_width / 2 < 0) {
        /*左边界*/
        x = coins_width / 2;
    } else if (x - coins_width / 2 > stage_width) {
        /*右边界*/
        x = stage_width - coins_width / 2;
    }

    if (y - coins_height / 2 < 0) {
        /*上边界*/
        y = coins_height / 2;
    } else if (y - coins_height / 2 > stage_height) {
        /*下边界*/
        y = stage_height - coins_height / 2;
    }

    return {
        x,
        y,
    };
}

function animateCoin(coin_views: Laya.Skeleton[], end_pos: Point) {
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

const pool = [] as Laya.Skeleton[];
function createCoinAni() {
    const item = pool.pop();
    if (item) {
        return item;
    }
    return createSprite('other', 'coin') as Laya.Skeleton;
}
