import honor from 'honor';
import {
    fakeLoad,
    loadRes,
    mergeProgressObserver,
    ResItem,
    toProgressObserver,
    promiseToProgressObserver,
} from 'honor/utils/loadRes';

import { AppCtrl } from '@app/ctrl/appCtrl';
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
import Loading from '@app/view/scenes/loadingView';

import { FishCtrl } from '../fishCtrl';
import { GameCtrlUtils } from '../gameCtrl';
import { NormalPlayerCom } from '../gameNormal/NormalPlayerCom';
import { onGameSocket } from '../gameSocket';
import { PlayerCtrl } from '../playerCtrl';
import { genUserInfo, mockSocket } from './utils';

export class GameTestCtrl implements GameCtrlUtils {
    public currency = '';
    public isTrial: EnterGameRep['isTrial'];
    changeUserNumInfo(data: any) {
        /*  */
    }

    public player_list: Set<PlayerCtrl> = new Set();
    public fish_view: FishView;
    public static async preEnter() {
        const [view, socket] = await mergeProgressObserver(
            [
                toProgressObserver(GameView.preEnter)(),
                promiseToProgressObserver(mockSocket)(),
                toProgressObserver(fakeLoad)(1),
                toProgressObserver(AppCtrl.commonLoad)(),
                toProgressObserver(loadRes)(res.gameTutorial),
            ],
            Loading,
        );

        const game_model = new GameModel();
        const ctrl = new GameTestCtrl(view as GameView, game_model);
        ctrl.view.showBubbleRefresh(1);
        onGameSocket(socket as WebSocketTrait, ctrl as any);
        return ctrl;
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
                const ctrl = new FishCtrl(fish_view, fish, this);
            },
            this,
        );
        event.on(
            GameEvent.AddPlayer,
            (player: PlayerModel) => {
                const player_view = view.addGun();
                const ctrl = new PlayerCtrl(player_view, player, this as any);
                const normal_player_com = new NormalPlayerCom(
                    player,
                    this as any,
                );
                ctrl.addCom(normal_player_com);
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
    buySkillTip() {}
    getSocket() {
        return getSocket(ServerName.Game);
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
