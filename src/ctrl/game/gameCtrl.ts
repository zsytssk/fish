import { ctrlState } from 'ctrl/ctrlState';
import { res } from 'data/res';
import honor from 'honor';
import { ResItem } from 'honor/utils/loadRes';
import { FishModel } from 'model/game/fishModel';
import { GameEvent, GameModel } from 'model/game/gameModel';
import { PlayerModel } from 'model/game/playerModel';
import { setProps } from 'utils/utils';
import GameView from 'view/scenes/game/gameView';
import { FishCtrl } from './fishCtrl';
import { PlayerCtrl } from './playerCtrl';
import { FreezingComEvent } from 'model/game/com/freezingCom';
import { activeFreeze, stopFreeze } from 'view/scenes/game/ani_wrap/freeze';
import HelpPop from 'view/pop/help';
import LotteryPop from 'view/pop/lottery';

/** 游戏ctrl */
export class GameCtrl {
    public view: GameView;
    private model: GameModel;
    constructor(view: GameView, model: GameModel) {
        this.view = view;
        this.model = model;
        this.init();
    }
    public static async preEnter() {
        const view = (await GameView.preEnter()) as GameView;
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
        const { btn_help, btn_gift, btn_voice, btn_leave } = view;
        const { CLICK } = Laya.Event;

        event.on(GameEvent.AddFish, (fish: FishModel) => {
            const { type, id, horizon_turn } = fish;
            const fish_view = view.addFish({ type, id, horizon_turn });
            const ctrl = new FishCtrl(fish_view, fish);
        });
        event.on(GameEvent.AddPlayer, (player: PlayerModel) => {
            if (player.is_cur_player && player.server_index > 1) {
                view.upSideDown();
            }
            const player_view = view.addGun();
            const ctrl = new PlayerCtrl(player_view, player);
        });
        event.on(FreezingComEvent.Freezing, () => {
            activeFreeze();
        });
        event.on(FreezingComEvent.UnFreezing, () => {
            stopFreeze();
        });

        btn_help.on(CLICK, this, (e: Laya.Event) => {
            e.stopPropagation();
            HelpPop.preEnter();
        });
        btn_gift.on(CLICK, this, (e: Laya.Event) => {
            e.stopPropagation();
            LotteryPop.preEnter();
        });
        btn_voice.on(CLICK, this, (e: Laya.Event) => {
            e.stopPropagation();
        });
        btn_leave.on(CLICK, this, (e: Laya.Event) => {
            e.stopPropagation();
        });
    }
}
