import { FishCtrl } from './fishCtrl';
import Game from 'view/scenes/game';
import { GameModel, GameEvent } from 'model/gameModel';
import { FishModel } from 'model/fishModel';
import { setProps } from 'utils/utils';
import honor from 'honor';
import { res } from 'data/res';

export const state = {} as {
    game_ctrl: GameCtrl;
    game_model: GameModel;
};

export class GameCtrl {
    private view: Game;
    private model: GameModel;
    constructor(view: Game, model: GameModel) {
        this.view = view;
        this.model = model;
        this.init();
    }
    public static async preEnter() {
        const view = (await Game.preEnter()) as Game;
        await honor.director.load(res.game);
        const game_model = new GameModel();
        const game_ctrl = new GameCtrl(view, game_model);

        setProps(state, { game_ctrl, game_model });
    }
    private init() {
        this.initEvent();
    }
    private initEvent() {
        const event = this.model.event;
        const { view } = this;
        event.on(GameEvent.addFish, (fish: FishModel) => {
            const fish_view = view.addFish(fish.type);
            const ctrl = new FishCtrl(fish_view, fish);
        });
    }
}
