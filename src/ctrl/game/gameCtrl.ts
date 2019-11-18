import { ctrlState } from 'ctrl/ctrlState';
import { waitConnectGame } from 'ctrl/hall/login';
import { disconnectSocket, getSocket } from 'ctrl/net/webSocketWrapUtil';
import { SkillMap } from 'data/config';
import { res } from 'data/res';
import { ServerName, ServerEvent } from 'data/serverEvent';
import honor from 'honor';
import { ResItem } from 'honor/utils/loadRes';
import { FreezingComEvent } from 'model/game/com/gameFreezingCom';
import { ShoalEvent } from 'model/game/com/shoalCom';
import { FishModel } from 'model/game/fish/fishModel';
import { GameEvent, GameModel } from 'model/game/gameModel';
import { PlayerInfo, PlayerModel } from 'model/game/playerModel';
import { isCurUser } from 'model/modelState';
import { setProps } from 'utils/utils';
import AlertPop from 'view/pop/alert';
import HelpPop from 'view/pop/help';
import LotteryPop from 'view/pop/lottery';
import { activeFreeze, stopFreeze } from 'view/scenes/game/ani_wrap/freeze';
import { activeShoalWave } from 'view/scenes/game/ani_wrap/shoalWave';
import GameView, { BulletBoxPos } from 'view/scenes/game/gameView';
import { FishCtrl } from './fishCtrl';
import { onGameSocket, sendToSocket, offGameSocket } from './gameSocket';
import { PlayerCtrl } from './playerCtrl';
import { HallCtrl } from 'ctrl/hall/hallCtrl';

/** 游戏ctrl */
export class GameCtrl {
    public view: GameView;
    private model: GameModel;
    constructor(view: GameView, model: GameModel) {
        this.view = view;
        this.model = model;
    }
    public static async preEnter(url: string, game_model: GameModel) {
        const view = (await GameView.preEnter()) as GameView;
        await honor.director.load(res.game as ResItem[]);
        const game_ctrl = new GameCtrl(view, game_model);
        game_ctrl.init(url);
        setProps(ctrlState, { game: game_ctrl });
    }
    private init(url) {
        this.initEvent();
        waitConnectGame(url).then(() => {
            onGameSocket(getSocket('game'), this);
        });
    }
    private initEvent() {
        const { view } = this;
        const { btn_help, btn_gift, btn_voice, btn_leave } = view;
        const { CLICK } = Laya.Event;

        this.onModel();
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
            AlertPop.alert('确定要离开游戏吗?').then(type => {
                if (type === 'confirm') {
                    sendToSocket(ServerEvent.RoomOut);
                }
            });
        });
    }
    private onModel() {
        const { event } = this.model;
        const { view } = this;
        event.on(GameEvent.AddFish, (fish: FishModel) => {
            const { type, id, horizon_turn } = fish;
            const fish_view = view.addFish({ type, id, horizon_turn });
            const ctrl = new FishCtrl(fish_view, fish);
        });
        event.on(GameEvent.AddPlayer, (player: PlayerModel) => {
            const { server_index, is_cur_player } = player;
            if (is_cur_player) {
                if (server_index > 1) {
                    view.upSideDown();
                }
                let pos = 'left' as BulletBoxPos;
                if (server_index === 1 || server_index === 2) {
                    pos = 'right';
                }
                view.setBulletBoxPos(pos);
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
        event.on(ShoalEvent.PreAddShoal, () => {
            activeShoalWave(true);
        });
        event.on(GameEvent.Destroy, () => {
            this.destroy();
        });
    }
    public onShoot(data: ShootRep) {
        this.model.shoot(data);
    }
    public onHit(data: HitRep) {
        this.model.captureFish(data);
    }
    public shoalComingTip() {
        this.model.shoalComingTip();
    }
    public activeSkill(skill: SkillMap, data: any) {
        this.model.activeSkill(skill, data);
    }
    public addFish(fish_list: ServerFishInfo[]) {
        for (const fish of fish_list) {
            this.model.addFish(fish);
        }
    }
    public addPlayers(player_list: PlayerInfo[]) {
        for (const player of player_list) {
            this.model.addPlayer(player);
        }
    }
    public changeBulletCost(data: ChangeTurretRep) {
        const { userId, multiple } = data;
        const player = this.model.getPlayerById(userId);
        player.updateInfo({
            bullet_cost: multiple,
        });
    }
    public tableOut(data: TableOutRep) {
        const { model } = this;
        const { userId } = data;
        if (isCurUser(userId)) {
            AlertPop.alert('你被踢出房间, 刷新重新进入').then(() => {
                location.reload();
            });
        } else {
            const player = model.getPlayerById(userId);
            player.destroy();
        }
    }
    public roomOut(data: RoomOutRep) {
        const { model } = this;
        const { userId } = data;
        if (isCurUser(userId)) {
            offGameSocket(this);
            disconnectSocket(ServerName.Game);
            model.destroy();
            HallCtrl.preEnter();
        }
    }
    public destroy() {
        this.view = undefined;
        this.model = undefined;
        setProps(ctrlState, { game: undefined });
    }
}
