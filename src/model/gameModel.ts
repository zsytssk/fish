import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { FishModel } from './fishModel';
import { PlayerModel } from './playerModel';

export const GameEvent = {
    addFish: 'add_fish',
};
export class GameModel extends ComponentManager {
    private fish_list: Set<FishModel> = new Set();
    private player_list: Set<PlayerModel> = new Set();
    constructor() {
        super();
        this.addCom(new EventCom());
    }
    public get event() {
        return this.getCom(EventCom);
    }
    public addFish(fish_info: ServerFishInfo) {
        const fish = new FishModel(fish_info, this);
        this.fish_list.add(fish);
        this.getCom(EventCom).emit(GameEvent.addFish, fish);
    }
    public removeFish(fish: FishModel) {
        this.fish_list.delete(fish);
    }
    public addPlayer(data: ServerFishInfo) {
        const fish = new PlayerModel(data, this);
        this.fish_list.add(fish);
        this.getCom(EventCom).emit(GameEvent.addFish, fish);
    }
    public removePlayer(fish: FishModel) {
        this.fish_list.delete(fish);
    }
}
