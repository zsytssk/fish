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
    public addFish(data: ServerFishInfo) {
        const fish = new FishModel(data, this);
        this.fish_list.add(fish);
        this.getCom(EventCom).emit(GameEvent.addFish, fish);
    }
    public removeFish(fish: FishModel) {
        this.fish_list.delete(fish);
    }
}
