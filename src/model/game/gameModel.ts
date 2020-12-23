import { GameFreezeCom } from './com/gameFreezeCom';
import { ShoalCom } from './com/shoalCom';
import { FishModel } from './fish/fishModel';
import { PlayerInfo, PlayerModel } from './playerModel';
import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';
import { EventCom } from 'comMan/eventCom';
import { SkillMap } from 'data/config';
import {
    createFish,
    createFishGroup,
    playerCaptureFish,
} from './fish/fishModelUtils';
import { ModelEvent } from 'model/modelEvent';
import { error } from 'utils/log';

export const GameEvent = {
    /** 添加鱼 */
    AddFish: 'add_fish',
    /** 添加用户 */
    AddPlayer: 'add_player',
    /** 冰冻 */
    Freezing: 'freezing',
    Destroy: ModelEvent.Destroy,
};

export class GameModel extends ComponentManager {
    public fish_map: Map<string, FishModel> = new Map();
    private player_map: Map<string, PlayerModel> = new Map();
    constructor() {
        super();
        this.initCom();
    }
    private initCom() {
        this.addCom(new EventCom(), new TimeoutCom());
    }
    public get event() {
        return this.getCom(EventCom);
    }
    /** 冰冻的处理  */
    public get freezing_com() {
        let freezing_com = this.getCom(GameFreezeCom);
        if (!freezing_com) {
            freezing_com = new GameFreezeCom(this);
            this.addCom(freezing_com);
        }
        return freezing_com;
    }
    public addFish(fish_info: ServerFishInfo) {
        const { group } = fish_info;
        const { fish_map } = this;
        if (!group) {
            /** 创建单个鱼 */
            const fish = createFish(fish_info, this);
            if (!fish) {
                return;
            }
            fish_map.set(fish.id, fish);
            this.event.emit(GameEvent.AddFish, fish);
            fish.init();
            return fish;
        } else {
            /** 创建鱼组 */
            const fish_arr = createFishGroup(fish_info, this);
            for (const fish of fish_arr) {
                fish_map.set(fish.id, fish);
                this.event.emit(GameEvent.AddFish, fish);
                fish.init();
            }

            return fish_arr;
        }
    }
    public removeFish(fish: FishModel) {
        this.fish_map.delete(fish.id);
    }
    public getFishById(id: string) {
        const { fish_map } = this;
        return fish_map.get(id);
    }
    public getAllFish() {
        return this.fish_map;
    }
    public captureFish(info: HitRep) {
        const { userId, eid, backAmount } = info;
        const player = this.getPlayerById(userId);
        const fish = this.getFishById(eid);

        if (!player) {
            error(`Game:>captureFish:> cant find player for ${userId}`);
            return;
        }
        if (backAmount) {
            player.updateInfo({
                bullet_num: player.bullet_num + backAmount,
            });
        }

        if (!fish) {
            error(`Game:>captureFish:> cant find fish for ${eid}`);
            return;
        }
        playerCaptureFish(player, fish, info);
    }
    /** 鱼群的处理逻辑 */
    public get shoal_com() {
        let shoal_com = this.getCom(ShoalCom);
        if (!shoal_com) {
            shoal_com = new ShoalCom(this);
            this.addCom(shoal_com);
        }
        return shoal_com;
    }
    /** 添加用户 */
    public addPlayer(data: PlayerInfo) {
        const player = new PlayerModel(data, this);
        this.player_map.set(data.user_id, player);
        this.event.emit(GameEvent.AddPlayer, player);
        player.init();
        return player;
    }
    public getCurPlayer() {
        const { player_map } = this;
        for (const [, player] of player_map) {
            if (player.is_cur_player) {
                return player;
            }
        }
    }
    public getPlayers() {
        return this.player_map;
    }
    public getPlayerById(id: string) {
        return this.player_map.get(id);
    }
    /** 移除用户 */
    public removePlayer(player: PlayerModel) {
        this.player_map.delete(player.user_id);
    }
    public activeSkill(skill: SkillMap, data: { user_id: string }) {
        const player = this.getPlayerById(data.user_id);
        if (!player) {
            error(`Game:>activeSkill:> cant find player:>${data.user_id}`);
            return;
        }
        player.activeSkill(skill, data);
    }
    public disableSkill(skill: SkillMap, user_id: string) {
        const player = this.getPlayerById(user_id);
        if (!player) {
            error(`Game:>resetSkill:> cant find player:>${user_id}`);
            return;
        }
        player.disableSkill(skill);
    }
    public resetSkill(skill: SkillMap, user_id: string) {
        const player = this.getPlayerById(user_id);
        if (!player) {
            error(`Game:>resetSkill:> cant find player:>${user_id}`);
            return;
        }
        player.resetSkill(skill);
    }
    public shoot(data: ShootRep) {
        const player = this.getPlayerById(data.userId);
        if (!player) {
            error(`Game:>resetSkill:> cant find player:>${data.userId}`);
            return;
        }
        player.gun.addBullet(data.direction, !player.is_cur_player);
    }
    public shoalComingTip(reverse: boolean) {
        this.shoal_com.preAddShoal(reverse);
    }
    public clear() {
        const { fish_map, player_map } = this;
        for (const [, player] of player_map) {
            player.destroy();
        }
        for (const [, fish] of fish_map) {
            fish.destroy();
        }
        this.fish_map.clear();
        this.player_map.clear();
    }
    public destroy() {
        this.event.emit(GameEvent.Destroy);
        this.clear();
        super.destroy();
    }
}
