import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { FishModel } from './fishModel';
import { clearModelState, modelState } from './modelState';
import { PlayerModel, PlayerInfo } from './playerModel';
import { ShoalCom } from './com/shoalCom';

export const GameEvent = {
    /** 添加鱼 */
    AddFish: 'add_fish',
    /** 添加用户 */
    AddPlayer: 'add_player',
};

export class GameModel extends ComponentManager {
    public fish_list: Set<FishModel> = new Set();
    private player_list: Set<PlayerModel> = new Set();
    constructor() {
        super();

        this.init();
        modelState.game = this;
    }
    private init() {
        this.addCom(new EventCom());
    }
    public get event() {
        return this.getCom(EventCom);
    }
    public addFish(fish_info: ServerFishInfo) {
        const fish = new FishModel(fish_info, this);
        this.fish_list.add(fish);
        this.event.emit(GameEvent.AddFish, fish);
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
    public captureFish(fish_info: CaptureFishInfo) {
        const fish = this.getFishById(fish_info.fishId);
        fish.beCapture();
    }
    /** 鱼群的处理逻辑 */
    public get shoal_com() {
        let shoal_com = this.getCom(ShoalCom);
        if (!shoal_com) {
            shoal_com = new ShoalCom();
            this.addCom(shoal_com);
        }
        return shoal_com;
    }
    /** 添加用户 */
    public addPlayer(data: PlayerInfo) {
        const player = new PlayerModel(data, this);
        this.player_list.add(player);
        this.event.emit(GameEvent.AddPlayer, player);
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
    public destroy() {
        clearModelState();
    }
}
