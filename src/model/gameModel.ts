import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { FishModel } from './fishModel';
import { clearModelState, modelState } from './modelState';
import { PlayerModel, PlayerInfo } from './playerModel';

export const GameEvent = {
    addFish: 'add_fish',
    addPlayer: 'add_player',
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
        this.event.emit(GameEvent.addFish, fish);
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
    public addPlayer(data: PlayerInfo) {
        const player = new PlayerModel(data, this);
        this.player_list.add(player);
        this.event.emit(GameEvent.addPlayer, player);
    }
    public removePlayer(player: PlayerModel) {
        this.player_list.delete(player);
    }
    public destroy() {
        clearModelState();
    }
}
