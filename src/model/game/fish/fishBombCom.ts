import { PlayerModel } from '../playerModel';
import { FishModel } from './fishModel';
import { getBeBombFish } from './fishModelUtils';

export const FishBombEvent = {
    FishBomb: 'fish_bomb',
};
export type FishBombInfo = {
    pos: Point;
    fish_list?: FishModel[];
    player: PlayerModel;
};
export class FishBombCom {
    private fish: FishModel;
    constructor(fish: FishModel) {
        this.fish = fish;
    }
    public active(player: PlayerModel) {
        const { fish } = this;
        const { pos, id } = fish;
        const data = {
            pos,
            player,
        } as FishBombInfo;
        if (player.need_emit) {
            data.fish_list = getBeBombFish(pos).filter((item) => {
                return item.id !== id;
            });
        }
        fish.event.emit(FishBombEvent.FishBomb, data);
    }
    public destroy() {
        this.fish.event?.offAllCaller(this);
        this.fish = undefined;
    }
}
