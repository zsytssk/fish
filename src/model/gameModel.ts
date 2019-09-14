import { ComponentManager } from 'comMan/component';
import { EventCom } from 'comMan/eventCom';

export class GameModel extends ComponentManager {
    private player_list: Set<any>;
    private fish_list: Set<any>;
    constructor() {
        super();
        this.add(new EventCom());
    }
}
