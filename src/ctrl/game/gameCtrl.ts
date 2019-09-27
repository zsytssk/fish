import { ctrlState } from 'ctrl/ctrlState';
import { res } from 'data/res';
import honor from 'honor';
import { ResItem } from 'honor/utils/loadRes';
import { FishModel } from 'model/fishModel';
import { GameEvent, GameModel } from 'model/gameModel';
import { PlayerModel } from 'model/playerModel';
import { setProps } from 'utils/utils';
import Game from 'view/scenes/game/game';
import { FishCtrl } from './fishCtrl';
import { PlayerCtrl } from './playerCtrl';

/** 游戏ctrl */
export class GameCtrl {
    public view: Game;
    private model: GameModel;
    constructor(view: Game, model: GameModel) {
        this.view = view;
        this.model = model;
        this.init();
    }
    public static async preEnter() {
        const view = (await Game.preEnter()) as Game;
        await honor.director.load(res.game as ResItem[]);
        const game_model = ctrlState.app.enterGame();
        const game_ctrl = new GameCtrl(view, game_model);

        setProps(ctrlState, { game: game_ctrl });
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
        event.on(GameEvent.addPlayer, (player: PlayerModel) => {
            const player_view = view.addGun(player.gun.skin);
            const ctrl = new PlayerCtrl(player_view, player);
        });
    }
}
