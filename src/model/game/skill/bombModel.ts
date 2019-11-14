import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';
import { getFishById } from 'model/modelState';
import { playerCaptureFish } from '../fish/fishModelUtils';
import { SkillActiveInfo, SkillCoreCom, SkillInfo } from './skillCoreCom';
import { SkillModel } from './skillModel';

export type BombInfo = {
    user_id: string;
    pos: Point;
    fish_list: UseBombFishInfo[];
    /** 炸弹鱼触发 */
    is_bomb_fish?: boolean;
} & SkillActiveInfo;

/** 炸弹技能: 提示用户选中屏幕的位置, 然后就发射炸弹 */
export class BombModel extends ComponentManager implements SkillModel {
    constructor(info: SkillInfo) {
        super();
        this.init(info);
    }
    public get skill_core() {
        return this.getCom(SkillCoreCom);
    }
    private init(info: SkillInfo) {
        this.addCom(new SkillCoreCom(info), new TimeoutCom());
    }
    public active(info: BombInfo) {
        // 激活
        const { num, fish_list, pos, used_time, is_bomb_fish } = info;
        const { skill_core } = this;
        const { player } = skill_core;

        for (const fish of fish_list) {
            const { eid: fish_id, win } = fish;
            const fish_model = getFishById(fish_id);
            playerCaptureFish(player, fish_model, win);
        }
        skill_core.activeEvent(pos);

        /** 炸弹鱼不激活技能的信息 */
        if (!is_bomb_fish) {
            return;
        }
        skill_core.active({ num, used_time });
    }
    public disable() {
        const { skill_core } = this;
        skill_core.disable();
    }
}
