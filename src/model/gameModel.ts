import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';
import { FishModel } from './fishModel';
import { PlayerModel } from './playerModel';

export class GameModel extends ComponentManager {
    private player_list: Set<FishModel>;
    private fish_list: Set<PlayerModel>;
    constructor() {
        super();
        this.add(new EventCom());
    }
    public addFish() {

    }
}
