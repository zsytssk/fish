import { ctrlState } from 'ctrl/ctrlState';
import { waitConnectGame } from 'ctrl/hall/login';
import { disconnectSocket, getSocket } from 'ctrl/net/webSocketWrapUtil';
import { SkillMap } from 'data/config';
import { res } from 'data/res';
import { ServerName, ServerEvent } from 'data/serverEvent';
import honor from 'honor';
import { ResItem } from 'honor/utils/loadRes';
import { FreezingComEvent } from 'model/game/com/gameFreezeCom';
import { ShoalEvent } from 'model/game/com/shoalCom';
import { FishModel } from 'model/game/fish/fishModel';
import { GameEvent, GameModel } from 'model/game/gameModel';
import { PlayerInfo, PlayerModel } from 'model/game/playerModel';
import { isCurUser, getUserInfo, modelState } from 'model/modelState';
import { setProps } from 'utils/utils';
import AlertPop from 'view/pop/alert';
import HelpPop from 'view/pop/help';
import LotteryPop from 'view/pop/lottery';
import { activeFreeze, stopFreeze } from 'view/scenes/game/ani_wrap/freeze';
import { activeShoalWave } from 'view/scenes/game/ani_wrap/shoalWave';
import GameView, { BulletBoxPos } from 'view/scenes/game/gameView';
import { FishCtrl } from './fishCtrl';
import {
    onGameSocket,
    sendToSocket,
    offGameSocket,
    convertEnterGame,
} from './gameSocket';
import { PlayerCtrl } from './playerCtrl';
import { HallCtrl } from 'ctrl/hall/hallCtrl';
import ShopPop from 'view/pop/shop';
import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from 'data/audioRes';
import VoicePop from 'view/pop/voice';
import { Event } from 'laya/events/Event';
import { log } from 'utils/log';
import { runAsyncTask } from 'honor/utils/tmpAsyncTask';
import { getLang } from 'ctrl/hall/hallCtrlUtil';
import { InternationalTip } from 'data/internationalConfig';

type AddItemInfo = {
    userId: string;
    id: string;
    num: number;
};
/** 游戏ctrl */
export class GameCtrl {
    public view: GameView;
    private model: GameModel;
    private cur_player_index: number;
    public player_list: Set<PlayerCtrl> = new Set();
    constructor(view: GameView, model: GameModel) {
        this.view = view;
        this.model = model;
    }
    private static instance: GameCtrl;
    public static async preEnter(url: string, game_model: GameModel) {
        if (this.instance) {
            return this.instance;
        }
        return runAsyncTask(() => {
            const wait_view = GameView.preEnter() as Promise<GameView>;
            const wait_load_res = honor.director.load(res.game as ResItem[]);
            return Promise.all([wait_view, wait_load_res]).then(([view]) => {
                const ctrl = new GameCtrl(view as GameView, game_model);
                this.instance = ctrl;
                ctrl.init(url);
                setProps(ctrlState, { game: ctrl });
                return ctrl;
            });
        }, this);
    }
    private init(url: string) {
        this.initEvent();
        AudioCtrl.play(AudioRes.GameBg, true);
        waitConnectGame(url).then(() => {
            onGameSocket(getSocket('game'), this);
        });
    }
    private initEvent() {
        const { view } = this;
        const { btn_help, btn_gift, btn_voice, btn_leave, btn_shop } = view;
        const { CLICK } = Event;

        this.onModel();
        btn_help.on(CLICK, this, (e: Event) => {
            e.stopPropagation();
            HelpPop.preEnter();
        });
        btn_gift.on(CLICK, this, (e: Event) => {
            e.stopPropagation();
            LotteryPop.preEnter();
        });
        btn_voice.on(CLICK, this, (e: Event) => {
            e.stopPropagation();
            VoicePop.preEnter();
        });
        btn_shop.on(CLICK, this, (e: Event) => {
            e.stopPropagation();
            ShopPop.preEnter();
        });
        btn_leave.on(CLICK, this, (e: Event) => {
            const lang = getLang();
            const { leaveTip } = InternationalTip[lang];

            e.stopPropagation();
            AlertPop.alert(leaveTip).then(type => {
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
                this.cur_player_index = server_index;
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
            const ctrl = new PlayerCtrl(player_view, player, this);
            this.player_list.add(ctrl);
        });
        event.on(FreezingComEvent.Freezing, () => {
            AudioCtrl.play(AudioRes.Freeze);
            activeFreeze();
        });
        event.on(FreezingComEvent.UnFreezing, () => {
            stopFreeze();
        });
        event.on(ShoalEvent.PreAddShoal, reverse => {
            AudioCtrl.play(AudioRes.ShoalComing);
            activeShoalWave(reverse).then(() => {
                view.showBubbleRefresh();
            });
        });
        event.on(GameEvent.Destroy, () => {
            this.destroy();
        });
    }
    public onEnterGame(data: ReturnType<typeof convertEnterGame>) {
        const { model, view } = this;
        const {
            fish,
            users,
            frozen,
            frozen_left,
            fish_list,
            exchange_rate,
        } = data;
        const { cur_balance } = getUserInfo();

        this.addPlayers(users);
        this.addFish(fish);
        /** 复盘冰冻 */
        if (frozen) {
            model.freezing_com.freezing(frozen_left, fish_list);
        }
        view.setExchangeRate(exchange_rate, cur_balance);
    }
    public calcClientIndex(server_index: number) {
        const { cur_player_index } = this;
        if (cur_player_index <= 1) {
            return server_index;
        }
        return 3 - server_index;
    }
    public onShoot(data: ShootRep) {
        const { direction } = data;
        if (!Object.keys(direction).length) {
            return;
        }
        this.model.shoot(data);
    }
    public onHit(data: HitRep) {
        this.model.captureFish(data);
    }
    public shoalComingTip(reverse: boolean) {
        this.model.shoalComingTip(reverse);
    }
    public resetSkill(skill: SkillMap, user_id: string) {
        this.model.resetSkill(skill, user_id);
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
    public addItemNum(data: AddItemInfo) {
        const { userId, id, num } = data;
        const player = this.model.getPlayerById(userId);
        player.addSkillNum(id, num);
    }
    public changeSkin(skinId: string) {
        // 取最后一位
        skinId = skinId.charAt(skinId.length - 1);
        const player = this.model.getPlayerById(
            modelState.app.user_info.user_id,
        );
        log('接收到use skin', skinId);
        player.changeSkin(skinId);
    }
    public tableOut(data: TableOutRep) {
        const { model } = this;
        const { userId } = data;
        if (isCurUser(userId)) {
            const lang = getLang();
            const { kickedTip } = InternationalTip[lang];
            AlertPop.alert(kickedTip, {
                hide_cancel: true,
            }).then(() => {
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
        GameCtrl.instance = undefined;
        setProps(ctrlState, { game: undefined });
    }
}
