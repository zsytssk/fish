import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';
import { Config } from 'data/config';
import { BodyCom } from 'model/game/com/bodyCom';
import { getCollisionAllFish, getFishById } from 'model/modelState';
import * as SAT from 'sat';
import { SkillCoreCom, SkillInfo, SkillActiveInfo } from './skillCoreCom';
import { SkillModel } from './skillModel';

export type BombInfo = {
    user_id: string;
    pos: Point;
    fish_list: UseBombFishInfo[];
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
        const { num, fish_list, pos, used_time } = info;
        const { skill_core } = this;
        const { player } = skill_core;

        skill_core.activeEvent(pos);
        skill_core.active({ num, used_time });
        const wait_arr = [] as Array<Promise<void>>;
        for (const fish of fish_list) {
            const { eid: fish_id, win } = fish;
            const fish_model = getFishById(fish_id);
            const wait_kill_fish = fish_model.beCapture().then(_pos => {
                player.captureFish(_pos, win);
            });
            wait_arr.push(wait_kill_fish);
        }
    }
    /** 获取炸到的鱼 */
    public getBombFish(pos: Point): string[] {
        const time_out = this.getCom(TimeoutCom);
        const body = createBombBody();
        body.update(pos);
        const fish_list = getCollisionAllFish(body);
        time_out.createTimeout(() => {
            body.destroy();
        }, 500);
        return fish_list.map(item => {
            return item.id;
        });
    }
    public disable() {
        const { skill_core } = this;
        skill_core.disable();
    }
}

export function createBombBody() {
    const circle = new SAT.Circle(new SAT.Vector(0, 0), Config.BombRadius);
    const shape = {
        shape: circle,
        pos: new SAT.Vector(0, 0),
    };
    return new BodyCom([shape], false);
}
