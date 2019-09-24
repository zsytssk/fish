import honor from 'honor';
import { createSkeleton } from 'honor/utils/createSkeleton';
import { ui } from '../../ui/layaMaxUI';

export default class Game extends ui.scenes.gameUI {
    public static preEnter() {
        return honor.director.runScene('scenes/game.scene', '参数1', '参数2');
    }
    public addFish(type: string) {
        const { pool } = this;
        const fish = createSkeleton('ani/fish/fish' + type);
        pool.addChild(fish);
        return fish;
    }
}
