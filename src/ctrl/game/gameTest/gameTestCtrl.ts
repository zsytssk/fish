import honor from 'honor';
import { loadRes, ResItem } from 'honor/utils/loadRes';

import { ctrlState } from '@app/ctrl/ctrlState';
import { offCommon } from '@app/ctrl/hall/commonSocket';
import { WebSocketTrait } from '@app/ctrl/net/webSocketWrap';
import { getSocket } from '@app/ctrl/net/webSocketWrapUtil';
import { res } from '@app/data/res';
import { ServerName } from '@app/data/serverEvent';
import { FishModel } from '@app/model/game/fish/fishModel';
import { GameEvent, GameModel } from '@app/model/game/gameModel';
import { PlayerModel } from '@app/model/game/playerModel';
import { modelState } from '@app/model/modelState';
import { setProps } from '@app/utils/utils';
import { FishView } from '@app/view/scenes/game/fishView';
import GameView from '@app/view/scenes/game/gameView';

import { FishCtrl } from '../fishCtrl';
import { onGameSocket } from '../gameSocket';
import { PlayerCtrl } from '../playerCtrl';
import { genUserInfo, mockSocket } from './utils';

export class GameTestCtrl {
    public player_list: Set<PlayerCtrl> = new Set();
    public fish_view: FishView;
    public static async preEnter() {
        const wait_view = GameView.preEnter() as Promise<GameView>;
        const wait_load_res = loadRes(res.gameTutorial as ResItem[]);
        const wait_socket = mockSocket();
        const wait_enter = Promise.all([
            wait_view,
            wait_socket,
            wait_load_res,
        ]).then(([view, socket]) => {
            const game_model = modelState.app.enterGame();
            const ctrl = new GameTestCtrl(view as GameView, game_model);
            ctrl.view.showBubbleRefresh(1);
            onGameSocket(socket as WebSocketTrait, ctrl as any);
            return ctrl;
        });

        return wait_enter;
    }
    constructor(public view: GameView, public model: GameModel) {
        modelState.game = model;
        this.onModel();
        genUserInfo(this);
    }
    public needUpSideDown() {
        return false;
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
    public sendToGameSocket(...params: Parameters<WebSocketTrait['send']>) {
        const socket = getSocket(ServerName.Game);
        socket?.send(...params);
    }
    public offGameSocket() {
        const socket = getSocket(ServerName.Game);
        offCommon(socket, this);
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
        this.offGameSocket();
        this.model?.event?.offAllCaller(this);

        this.model = undefined;
        this.view = undefined;
        setProps(ctrlState, { game: undefined });
        this.player_list = new Set();
    }
}
