import { ComponentManager } from 'comMan/component';

import { Config } from '@app/data/config';
import { FishModel } from '@app/model/game/fish/fishModel';
import { CurveInfo, Displace } from '@app/utils/displace/displace';
import { calcNormalLen } from '@app/utils/displace/displaceUtil';
import { Line } from '@app/utils/displace/line';

import { GameModel } from '../gameModel';
import { DisplaceMoveCom } from './moveCom/displaceMoveCom';

export const ShoalEvent = {
    /** 添加鱼群前的清理 */
    PreAddShoal: 'pre_add_shoal',
};

/** 鱼群的处理逻辑 */
export class ShoalCom extends ComponentManager {
    private game: GameModel;
    /** 鱼群的数据 一个鱼群id 只能同时存在一个 */
    public shoal_map: Map<string, Set<FishModel>> = new Map();
    constructor(game: GameModel) {
        super();
        this.game = game;
    }
    /** 添加鱼群前 处理 */
    public preAddShoal(reverse: boolean) {
        const { event, fish_map } = this.game;
        event.emit(ShoalEvent.PreAddShoal, reverse);
        for (const [, fish] of fish_map) {
            quickLeaveFish(fish, reverse);
        }
    }
    /** 添加鱼群 */
    public addShoal(shoal_info) {}
    /** 清理鱼群 */
    public removeShoal(shoal_id: string) {
        this.shoal_map.delete(shoal_id);
    }
    /** 生成鱼群中的鱼 */
    private genFish() {}
    public destroy() {}
}

/**
 * 鱼快速离开页面的处理
 * @param fish 鱼的model
 * @param reverse  -> 鱼往x=0游动, true -> 鱼往x=1920游动
 */
export function quickLeaveFish(fish: FishModel, reverse) {
    const { pos: start_pos, visible } = fish;
    if (!visible) {
        return fish.destroy();
    }

    const { ClearFishTime, PoolWidth } = Config;
    const leave_fish_len = calcNormalLen('after', fish.type);
    const end_pos = { y: start_pos.y } as Point;
    let len: number;
    if (!reverse) {
        end_pos.x = -leave_fish_len;
        len = start_pos.x + leave_fish_len;
    } else {
        len = PoolWidth - start_pos.x + leave_fish_len;
        end_pos.x = PoolWidth + leave_fish_len;
    }
    const line = new Line(start_pos, end_pos);
    const curves = [
        {
            curve: line,
            length: len,
            radio: 1,
        },
    ] as CurveInfo[];
    const displace = new Displace(ClearFishTime, 0, curves, false);

    const move_com = new DisplaceMoveCom(displace);
    fish.setMoveCom(move_com);
    fish.init();
}
