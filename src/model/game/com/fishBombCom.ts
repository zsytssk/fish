import { FishModel } from '../fishModel';
import { createBombBody } from '../skill/bombModel';
import { getCollisionAllFish } from 'model/modelState';

export const FishBombEvent = {
    FishBomb: 'fish_bomb',
};
export class FishBombCom {
    constructor(private fish: FishModel) {}
    public getBombFish(pos: Point): string[] {
        const body = createBombBody();
        body.update(pos);
        const fish_list = getCollisionAllFish(body);
        body.destroy();
        return fish_list.map(item => {
            return item.id;
        });
    }
}
