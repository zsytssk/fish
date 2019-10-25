import * as SAT from 'sat';
import { ComponentManager } from 'comMan/component';
import { modelState, getCollisionAllFish } from 'model/modelState';
import { SkillCoreCom, SkillInfo } from './skillCoreCom';
import { SkillModel } from './skillModel';
import { BodyCom } from 'model/com/bodyCom';
import { Config } from 'data/config';
import { TimeoutCom } from 'comMan/timeoutCom';

export type BombInfo = {
    fish_list: string[];
} & SkillInfo;

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
    public active(info: SkillInfo) {
        // 激活
        const { skill_core } = this;
        const { game } = modelState.app;
        skill_core.active(info);
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
