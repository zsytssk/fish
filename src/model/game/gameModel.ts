import { FreezingCom } from './com/freezingCom';
import { ShoalCom } from './com/shoalCom';
import { FishModel } from './fishModel';
import { PlayerInfo, PlayerModel } from './playerModel';
import { createFish, createFishGroup } from '../modelState';
import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';
import { EventCom } from 'comMan/eventCom';
import { SkillMap } from 'data/config';

export const GameEvent = {
    /** 添加鱼 */
    AddFish: 'add_fish',
    /** 添加用户 */
    AddPlayer: 'add_player',
    /** 冰冻 */
    Freezing: 'freezing',
};

export class GameModel extends ComponentManager {
    public fish_list: Set<FishModel> = new Set();
    private player_list: Set<PlayerModel> = new Set();
    constructor() {
        super();
        this.init();
    }
    private init() {
        this.addCom(new EventCom(), new TimeoutCom());
    }
    public get event() {
        return this.getCom(EventCom);
    }
    /** 冰冻的处理  */
    public get freezing_com() {
        let freezing_com = this.getCom(FreezingCom);
        if (!freezing_com) {
            freezing_com = new FreezingCom(this);
            this.addCom(freezing_com);
        }
        return freezing_com;
    }
    public addFish(fish_info: ServerFishInfo) {
        const { group } = fish_info;
        if (!group) {
            /** 创建单个鱼 */
            const fish = createFish(fish_info, this);
            this.fish_list.add(fish);
            this.event.emit(GameEvent.AddFish, fish);
        } else {
            /** 创建鱼组 */
            const fish_list = createFishGroup(fish_info, this);
            for (const fish of fish_list) {
                this.fish_list.add(fish);
                this.event.emit(GameEvent.AddFish, fish);
            }
        }
    }
    public removeFish(fish: FishModel) {
        this.fish_list.delete(fish);
    }
    public getFishById(id: string) {
        const { fish_list } = this;
        for (const fish of fish_list) {
            if (fish.id === id) {
                return fish;
            }
        }
    }
    public getAllFish() {
        const { fish_list } = this;
        return [...fish_list];
    }
    public captureFish(info: HitRep) {
        const player = this.getPlayerById(info.userId);
        const fish = this.getFishById(info.eid);
        if (!fish || !player) {
            console.error('Game:>captureFish:> cant find fish or player!!');
            return;
        }
        player.captureFish(fish, info.win);
        fish.beCapture().then(pos => {
            if (!pos) {
                console.error('Game:>captureFish:> cant find fish pos!!');
                return;
            }
        });
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
        this.player_list.add(player);
        this.event.emit(GameEvent.AddPlayer, player);
        return player;
    }
    public getPlayerById(id: string) {
        const { player_list } = this;
        for (const player of player_list) {
            if (player.user_id === id) {
                return player;
            }
        }
    }
    /** 移除用户 */
    public removePlayer(player: PlayerModel) {
        this.player_list.delete(player);
    }
    public activeSkill(skill: SkillMap, data: { user_id: string }) {
        const player = this.getPlayerById(data.user_id);
        player.activeSkill(skill, data);
    }
    public shoot(data: ShootRep) {
        const player = this.getPlayerById(data.userId);
        player.gun.addBullet(data.direction);
    }
    public shoalComingTip() {
        this.shoal_com.preAddShoal();
    }
    public destroy() {
        const { fish_list, player_list } = this;
        for (const fish of fish_list) {
            fish.destroy();
        }
        for (const player of player_list) {
            player.destroy();
        }
        this.fish_list.clear();
        this.player_list.clear();
        super.destroy();
        // 离开游戏销毁...
    }
}
