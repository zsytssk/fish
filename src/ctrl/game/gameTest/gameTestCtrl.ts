import { SkillMap } from 'data/config';
import { res } from 'data/res';
import honor from 'honor';
import { ResItem } from 'honor/utils/loadRes';
import { FishModel } from 'model/game/fish/fishModel';
import { GameEvent, GameModel } from 'model/game/gameModel';
import { PlayerInfo, PlayerModel } from 'model/game/playerModel';
import { modelState } from 'model/modelState';
import GameView from 'view/scenes/game/gameView';
import { FishCtrl } from '../fishCtrl';
import { PlayerCtrl } from '../playerCtrl';
import { mockSocket, genUserInfo, resetMockSocketCtor } from './utils';
import { onGameSocket, offGameSocket } from '../gameSocket';
import { WebSocketTrait } from 'ctrl/net/webSocketWrap';
import { FishView } from 'view/scenes/game/fishView';
import { setProps } from 'utils/utils';
import { ctrlState } from 'ctrl/ctrlState';

export class GameTestCtrl {
    public player_list: Set<PlayerCtrl> = new Set();
    public fish_view: FishView;
    public static async preEnter() {
        const wait_view = GameView.preEnter() as Promise<GameView>;
        const wait_load_res = honor.director.load(res.game as ResItem[]);
        const wait_socket = mockSocket();
        const wait_enter = Promise.all([
            wait_view,
            wait_socket,
            wait_load_res,
        ]).then(([view, socket]) => {
            const game_model = new GameModel();
            const ctrl = new GameTestCtrl(view as GameView, game_model);
            onGameSocket(socket as WebSocketTrait, ctrl as any);
            return ctrl;
        });

        return await wait_enter;
    }
    constructor(public view: GameView, public model: GameModel) {
        this.onModel();
        genUserInfo(this);

        modelState.app.game = model;
    }
    private onModel() {
        const { event } = this.model;
        const { view } = this;
        event.on(
            GameEvent.AddFish,
            (fish: FishModel) => {
                const { type, id, horizon_turn, currency } = fish;
                const fish_view = view.addFish({
                    type,
                    id,
                    horizon_turn,
                    currency,
                });
                this.fish_view = fish_view;
                const ctrl = new FishCtrl(fish_view, fish);
            },
            this,
        );
        event.on(
            GameEvent.AddPlayer,
            (player: PlayerModel) => {
                const player_view = view.addGun();
                const ctrl = new PlayerCtrl(player_view, player, this as any);
                this.player_list.add(ctrl);
            },
            this,
        );
        event.on(
            GameEvent.Destroy,
            () => {
                this.destroy();
            },
            this,
        );
    }

    public calcClientIndex(server_index = 1) {
        return 1;
    }
    public onShoot(data: ShootRep) {
        this.model.shoot(data);
    }
    public onHit(data: HitRep) {
        this.model.captureFish(data);
    }
    public addFish(fish_list: ServerFishInfo[]) {
        for (const fish of fish_list) {
            this.model.addFish(fish);
        }
    }
    public removePlayerCtrl(ctrl: PlayerCtrl) {
        this.player_list.delete(ctrl);
    }
    public destroy() {
        offGameSocket(this as any);
        this.model?.event?.offAllCaller(this);

        this.model = undefined;
        this.view = undefined;
        setProps(ctrlState, { game: undefined });
        this.player_list = new Set();
    }
}
