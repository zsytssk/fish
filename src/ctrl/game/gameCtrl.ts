import honor from 'honor';
import { ResItem } from 'honor/utils/loadRes';
import { runAsyncTask } from 'honor/utils/tmpAsyncTask';
import { Event } from 'laya/events/Event';
import { Loader } from 'laya/net/Loader';

import { ctrlState } from 'ctrl/ctrlState';
import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { HallCtrl } from 'ctrl/hall/hallCtrl';
import { getChannel, getLang } from 'ctrl/hall/hallCtrlUtil';
import { waitConnectGame } from 'ctrl/hall/login';
import { disconnectSocket, getSocket } from 'ctrl/net/webSocketWrapUtil';
import { AudioRes } from 'data/audioRes';
import { SkillMap } from 'data/config';
import { InternationalTip } from 'data/internationalConfig';
import { res } from 'data/res';
import { ServerErrCode, ServerEvent, ServerName } from 'data/serverEvent';
import { FreezingComEvent } from 'model/game/com/gameFreezeCom';
import { ShoalEvent } from 'model/game/com/shoalCom';
import { FishModel } from 'model/game/fish/fishModel';
import { GameEvent, GameModel } from 'model/game/gameModel';
import { PlayerInfo, PlayerModel } from 'model/game/playerModel';
import { isCurUser } from 'model/modelState';
import { tipPlatformCurrency } from 'model/userInfo/userInfoUtils';
import AlertPop from 'view/pop/alert';
import HelpPop from 'view/pop/help';
import LotteryPop from 'view/pop/lottery';
import ShopPop from 'view/pop/shop';
import VoicePop from 'view/pop/voice';
import { activeFreeze, stopFreeze } from 'view/scenes/game/ani_wrap/freeze';
import { activeShoalWave } from 'view/scenes/game/ani_wrap/shoalWave';
import GameView, { AddFishViewInfo, BulletBoxDir } from 'view/scenes/game/gameView';

import { default as random } from 'lodash/random';
import { BgMonitorEvent } from 'utils/bgMonitor';
import { error, log } from 'utils/log';
import { setProps } from 'utils/utils';

import { FishCtrl } from './fishCtrl';
import { disableAllUserOperation, disableCurUserOperation, tipExchange, waitEnterGame } from './gameCtrlUtils';
import { convertEnterGame, offGameSocket, onGameSocket, sendToGameSocket } from './gameSocket';
import { PlayerCtrl } from './playerCtrl';

export type ChangeUserNumInfo = {
    userId: string;
    change_arr: Array<{
        id?: string;
        num: number;
        type: 'skill' | 'bullet';
    }>;
};

/** 游戏ctrl */
export class GameCtrl {
    public isTrial: EnterGameRep['isTrial'];
    public view: GameView;
    private model: GameModel;
    public player_list: Set<PlayerCtrl> = new Set();
    constructor(view: GameView, model: GameModel) {
        this.view = view;
        this.model = model;
    }
    private static instance: GameCtrl;
    public static async preEnter(data: Partial<RoomInRep>, game_model: GameModel) {
        if (this.instance) {
            return this.instance;
        }
        return runAsyncTask(() => {
            const wait_view = GameView.preEnter() as Promise<GameView>;
            const [bg_num, bg_res] = this.genBgNum();
            const other_res: ResItem[] = [bg_res, ...res.game];
            const wait_load_res = honor.director.load(other_res, 'Scene');

            /** 只有第一次进入时提示 */
            console.log(`test:>1`, data);
            if (data.currency) {
                waitEnterGame().then(async ([status, _data]) => {
                    if (!status) {
                        return;
                    }
                    /** 提示 - 您的余额变动因链上区块确认可能有所延迟，请耐心等待。 */
                    if (getChannel() === 'YOUCHAIN' && !_data.isTrial) {
                        const lang = getLang();
                        await AlertPop.alert(InternationalTip[lang].delayUpdateAccount);
                    }
                    tipExchange(data);
                });
            } else {
                /** 复盘提示 */
                waitEnterGame().then(async ([status, _data]) => {
                    if (!status || _data.isTrial || !_data.currency) {
                        return;
                    }
                    tipPlatformCurrency(_data.currency);
                });
            }

            return Promise.all([wait_view, wait_load_res]).then(([view]) => {
                const ctrl = new GameCtrl(view as GameView, game_model);
                this.instance = ctrl;
                ctrl.init(data.socketUrl, bg_num);
                setProps(ctrlState, { game: ctrl });

                return ctrl;
            });
        }, this);
    }
    public static genBgNum() {
        const bg_num = random(1, 3);
        return [bg_num, { url: `image/game/normal_bg/bg${bg_num}.jpg`, type: Loader.IMAGE }] as [number, ResItem];
    }
    private init(url: string, bg_num: number) {
        this.initEvent();
        AudioCtrl.playBg(AudioRes.GameBg);
        this.view.showBubbleRefresh(bg_num);
        waitConnectGame(url).then(() => {
            onGameSocket(getSocket(ServerName.Game), this);
        });
    }
    private initEvent() {
        const { view } = this;
        const { btn_help, btn_gift, btn_voice, btn_leave, btn_shop } = view;
        const { CLICK } = Event;

        this.onModel();

        const { bg_monitor } = ctrlState.app;
        /** 切换到后台禁用自动开炮 */
        bg_monitor.event.on(
            BgMonitorEvent.VisibleChange,
            (isVisible: boolean) => {
                if (!isVisible) {
                    disableCurUserOperation();
                }
            },
            this,
        );

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
            AlertPop.alert(leaveTip).then((type) => {
                if (type === 'confirm') {
                    sendToGameSocket(ServerEvent.RoomOut);
                }
            });
        });
    }
    private onModel() {
        const { event } = this.model;
        const { view } = this;
        event.on(
            GameEvent.AddFish,
            (fish: FishModel) => {
                const { type, id, horizon_turn, currency } = fish;
                const fish_view_info: AddFishViewInfo = {
                    type,
                    currency,
                    id,
                    horizon_turn,
                };
                const fish_view = view.addFish(fish_view_info);
                const ctrl = new FishCtrl(fish_view, fish);
            },
            this,
        );
        event.on(
            GameEvent.AddPlayer,
            (player: PlayerModel) => {
                const { server_index, is_cur_player } = player;
                if (is_cur_player) {
                    if (server_index > 1) {
                        view.upSideDown();
                    }
                    let pos = 'left' as BulletBoxDir;
                    if (server_index === 1 || server_index === 2) {
                        pos = 'right';
                    }
                    view.setBulletBoxPos(pos);
                }

                const player_view = view.addGun();
                const ctrl = new PlayerCtrl(player_view, player, this);
                this.player_list.add(ctrl);
            },
            this,
        );
        event.on(
            FreezingComEvent.Freezing,
            () => {
                AudioCtrl.play(AudioRes.Freeze);
                activeFreeze();
            },
            this,
        );
        event.on(
            FreezingComEvent.UnFreezing,
            () => {
                stopFreeze();
            },
            this,
        );
        event.on(
            ShoalEvent.PreAddShoal,
            (reverse) => {
                AudioCtrl.play(AudioRes.ShoalComing);
                activeShoalWave(reverse);
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
    public onEnterGame(data: ReturnType<typeof convertEnterGame>) {
        const { model, view } = this;
        const { isTrial, fish, users, frozen, frozen_left, fish_list, exchange_rate, currency } = data;

        this.isTrial = isTrial;
        if (isTrial) {
            view.setTrialStyle();
        }
        this.addPlayers(users);
        this.addFish(fish);
        /** 复盘冰冻 */
        if (frozen) {
            model.freezing_com.freezing(frozen_left, fish_list);
        }
        view.setExchangeRate(exchange_rate, currency);
    }
    public calcClientIndex(server_index: number) {
        const cur_player = this.model.getCurPlayer();
        if (cur_player.server_index <= 1) {
            return server_index;
        }
        return 3 - server_index;
    }
    public onShoot(data: ShootRep) {
        const { direction } = data;
        if (!Object.keys(direction).length) {
            return;
        }
        /** 自己发射的特殊处理 */
        if (data.robotId) {
            data.userId = data.robotId;
        }
        this.model.shoot(data);
    }
    public onHit(data: HitRep) {
        this.model.captureFish(data);
    }
    public shoalComingTip(reverse: boolean) {
        this.model.shoalComingTip(reverse);
    }
    public activeSkill(skill: SkillMap, data: any) {
        this.model.activeSkill(skill, data);
    }
    public disableSkill(skill: SkillMap, user_id: any) {
        this.model.disableSkill(skill, user_id);
    }
    public resetSkill(skill: SkillMap, user_id: string) {
        this.model.resetSkill(skill, user_id);
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
    public setPlayersEmit(ids: string[]) {
        for (const item of ids) {
            const player = this.model.getPlayerById(item);
            if (player) {
                player.updateInfo({ need_emit: true });
            }
        }
    }
    public changeBulletCost(data: ChangeTurretRep) {
        const { userId, multiple } = data;
        const player = this.model.getPlayerById(userId);
        player.updateInfo({
            bullet_cost: multiple,
        });
    }
    public changeUserNumInfo(data: ChangeUserNumInfo) {
        const { userId, change_arr } = data;
        const player = this.model.getPlayerById(userId);
        for (const item of change_arr) {
            const { type, num, id } = item;
            if (type === 'skill') {
                player.addSkillNum(id, num);
            } else {
                player.updateInfo({
                    bullet_num: player.bullet_num + num,
                });
            }
        }
    }
    public changeSkin(data: UseSkinRep) {
        let { skinId } = data;
        const { userId } = data;
        // 取最后一位
        skinId = skinId.charAt(skinId.length - 1);
        const player = this.model.getPlayerById(userId);
        log('接收到use skin', skinId);
        player.changeSkin(skinId);
    }
    public tableOut(data: TableOutRep) {
        const { model } = this;
        const { userId, isTimeOut } = data;
        if (isCurUser(userId)) {
            const lang = getLang();
            const { kickedTip } = InternationalTip[lang];
            const timeout_tip = InternationalTip[lang][ServerErrCode.TrialTimeGame];
            const tip = isTimeOut ? timeout_tip : kickedTip;
            disableAllUserOperation();
            offGameSocket(this);
            disconnectSocket(ServerName.Game);
            AlertPop.alert(tip, {
                hide_cancel: true,
            }).then(() => {
                this.roomOut({ userId });
            });
        } else {
            const player = model.getPlayerById(userId);
            if (!player) {
                return error(`Game:>captureFish:> cant find player for userId=${userId}!`);
            }
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
    public reset() {
        this.model.clear();
    }
    public destroy() {
        const { bg_monitor } = ctrlState.app;
        this.model?.event.offAllCaller(this);
        bg_monitor.event.offAllCaller(this);
        this.view = undefined;
        this.model = undefined;
        GameCtrl.instance = undefined;
        honor.director.closeAllDialogs();
        setProps(ctrlState, { game: undefined });
    }
}
