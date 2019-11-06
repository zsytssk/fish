import { ComponentManager } from 'comMan/component';
import { ModelEvent } from 'model/modelEvent';
import { getGunInfo } from 'utils/dataUtil';
import { setProps } from 'utils/utils';
import { FishEvent } from './fishModel';
import { GunModel } from './gun/gunModel';
import { SkillInfo } from './skill/skillCoreCom';
import { SkillCtorMap, SkillModel } from './skill/skillModel';
import { EventCom } from 'comMan/eventCom';
import { SkillMap } from 'data/config';

type SkillInfoMap = {
    [key: string]: SkillInfo;
};
export type CaptureInfo = {
    pos: Point;
    win: number;
    resolve: FuncVoid;
};
export type PlayerInfo = {
    user_id: string;
    server_index: number;
    level: number;
    gold: number;
    gun_skin: string;
    nickname: string;
    avatar: string;
    is_cur_player: boolean;
    skills: SkillInfoMap;
};
export const PlayerEvent = {
    CaptureFish: FishEvent.BeCapture,
    UpdateInfo: 'update_info',
    Destroy: ModelEvent.Destroy,
};

/** 玩家的数据类 */
export class PlayerModel extends ComponentManager {
    /** 用户id */
    public user_id: string;
    /** 是否是当前用户 */
    public is_cur_player: boolean;
    /** 服务器的位置 */
    public server_index: number;
    /** 等级 */
    public level: number;
    /** 金币数量 */
    public gold: number;
    /** 用户名 */
    public nickname: string;
    /** 图像地址 */
    public avatar: string;
    /** 炮台 */
    public gun: GunModel;
    /** 技能列表 */
    public skill_map: Map<string, SkillModel> = new Map();
    constructor(player_info: PlayerInfo) {
        super();
        this.addCom(new EventCom());
        this.init(player_info);
    }
    public get event() {
        return this.getCom(EventCom);
    }
    private init(player_info: PlayerInfo) {
        const {
            user_id,
            server_index,
            level,
            gun_skin,
            nickname,
            avatar,
            gold,
            is_cur_player,
            skills,
        } = player_info;

        this.updateInfo({
            user_id,
            server_index,
            level,
            nickname,
            avatar,
            gold,
            is_cur_player,
        });

        const { pos } = getGunInfo(server_index);
        const gun = new GunModel(pos, gun_skin, this);
        this.gun = gun;

        this.initSkill(skills);
    }
    private updateInfo(info: Partial<PlayerInfo>) {
        setProps(this as PlayerModel, info);
    }
    private initSkill(skills: SkillInfoMap) {
        const { skill_map } = this;
        for (const key in SkillCtorMap) {
            if (!SkillCtorMap.hasOwnProperty(key)) {
                continue;
            }
            const ctor = SkillCtorMap[key];
            const info = {
                player: this,
                ...skills[key],
            };
            skill_map.set(key, new ctor(info));
        }
    }
    public activeSkill(skill: SkillMap, data = {} as any) {
        const skill_model = this.skill_map.get(skill);
        skill_model.active(data);
    }
    public captureFish(pos: Point, win: number) {
        const { gold } = this;
        new Promise((resolve, reject) => {
            this.event.emit(PlayerEvent.CaptureFish, {
                pos,
                win,
                resolve,
            } as CaptureInfo);
        }).then(() => {
            this.updateInfo({
                gold: gold + win,
            });
        });
    }
}
