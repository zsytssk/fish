import { default as random } from 'lodash/random';

import honor from 'honor';
import {
    toProgressObserver,
    fakeLoad,
    loadRes,
    mergeProgressObserver,
    ResItem,
} from 'honor/utils/loadRes';
import { runAsyncTask } from 'honor/utils/tmpAsyncTask';
import { Event } from 'laya/events/Event';
import { Loader } from 'laya/net/Loader';

import { ctrlState } from '@app/ctrl/ctrlState';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { getChannel, getLang } from '@app/ctrl/hall/hallCtrlUtil';
import { waitConnectGame } from '@app/ctrl/hall/login';
import { disconnectSocket, getSocket } from '@app/ctrl/net/webSocketWrapUtil';
import { AudioRes } from '@app/data/audioRes';
import { SkillMap } from '@app/data/config';
import { InternationalTip } from '@app/data/internationalConfig';
import { res } from '@app/data/res';
import { ServerErrCode, ServerEvent, ServerName } from '@app/data/serverEvent';
import { FreezingComEvent } from '@app/model/game/com/gameFreezeCom';
import { ShoalEvent } from '@app/model/game/com/shoalCom';
import { FishModel } from '@app/model/game/fish/fishModel';
import { GameEvent, GameModel } from '@app/model/game/gameModel';
import { PlayerInfo, PlayerModel } from '@app/model/game/playerModel';
import { SkillActiveData } from '@app/model/game/skill/skillModel';
import { isCurUser } from '@app/model/modelState';
import { tipPlatformCurrency } from '@app/model/userInfo/userInfoUtils';
import { BgMonitorEvent } from '@app/utils/bgMonitor';
import { onNodeWithAni } from '@app/utils/layaUtils';
import { error, log } from '@app/utils/log';
import { setProps } from '@app/utils/utils';
import AlertPop from '@app/view/pop/alert';
import HelpPop from '@app/view/pop/help';
import LotteryPop from '@app/view/pop/lottery';
import ShopPop from '@app/view/pop/shop';
import VoicePop from '@app/view/pop/voice';
import {
    activeFreeze,
    stopFreeze,
} from '@app/view/scenes/game/ani_wrap/freeze';
import { activeShoalWave } from '@app/view/scenes/game/ani_wrap/shoalWave';
import GameView, {
    AddFishViewInfo,
    BulletBoxDir,
} from '@app/view/scenes/game/gameView';
import Loading from '@app/view/scenes/loadingView';

import { AppCtrl } from '../appCtrl';
import { offCommon } from '../hall/commonSocket';
import { WebSocketTrait } from '../net/webSocketWrap';
import { FishCtrl } from './fishCtrl';
import {
    disableAllUserOperation,
    disableCurUserOperation,
    tipExchange,
    waitEnterGame,
} from './gameCtrlUtils';
import { NormalPlayerCom } from './gameNormal/NormalPlayerCom';
import { convertEnterGame, onGameSocket } from './gameSocket';
import { PlayerCtrl } from './playerCtrl';

export type ChangeUserNumInfo = {
    userId: string;
    change_arr: Array<{
        id?: string;
        num: number;
        type: 'skill' | 'bullet';
    }>;
};

export type GameCtrlUtils = {
    sendToGameSocket(...params: Parameters<WebSocketTrait['send']>): void;
    offGameSocket(): void;
    needUpSideDown(index: number): boolean;
    calcClientIndex(index: number): number;
    getSocket: () => WebSocketTrait;
    isTrial: EnterGameRep['isTrial'];
};

/** 游戏ctrl */
export class GameCtrl implements GameCtrlUtils {
    public isTrial: EnterGameRep['isTrial'];
    public view: GameView;
    private model: GameModel;
    public player_list: Set<PlayerCtrl> = new Set();
    constructor(view: GameView, model: GameModel) {
        this.view = view;
        this.model = model;
    }
    private static instance: GameCtrl;
    public static async preEnter(
        data: Partial<RoomInRep>,
        game_model: GameModel,
    ) {
        if (this.instance) {
            return this.instance;
        }
        return runAsyncTask(async () => {
            /** 只有第一次进入时提示 */
            if (data.currency) {
                waitEnterGame().then(async ([status, _data]) => {
                    if (!status) {
                        return;
                    }
                    /** 提示 - 您的余额变动因链上区块确认可能有所延迟，请耐心等待。 */
                    if (getChannel() === 'YOUCHAIN' && !_data.isTrial) {
                        const lang = getLang();
                        await AlertPop.alert(
                            InternationalTip[lang].delayUpdateAccount,
                        );
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

            const [bg_num, bg_res] = this.genBgNum();
            const other_res: ResItem[] = [bg_res, ...res.game];
            const [view] = await mergeProgressObserver(
                [
                    toProgressObserver(GameView.preEnter)(),
                    toProgressObserver(fakeLoad)(0.5),
                    toProgressObserver(AppCtrl.commonLoad)(),
                    toProgressObserver(loadRes)(other_res),
                ],
                Loading,
            );

            const ctrl = new GameCtrl(view as GameView, game_model);
            this.instance = ctrl;
            ctrl.init(data.socketUrl, bg_num);
            setProps(ctrlState, { game: ctrl });

            return ctrl;
        }, this);
    }
    public static genBgNum() {
        const bg_num = random(1, 3);
        return [
            bg_num,
            { url: `image/game/normal_bg/bg${bg_num}.jpg`, type: Loader.IMAGE },
        ] as [number, ResItem];
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

        onNodeWithAni(btn_help, CLICK, (e: Event) => {
            e.stopPropagation();
            HelpPop.preEnter();
        });
        onNodeWithAni(btn_gift, CLICK, (e: Event) => {
            e.stopPropagation();
            LotteryPop.preEnter();
        });
        onNodeWithAni(btn_voice, CLICK, (e: Event) => {
            e.stopPropagation();
            VoicePop.preEnter();
        });
        onNodeWithAni(btn_shop, CLICK, (e: Event) => {
            e.stopPropagation();
            ShopPop.preEnter();
        });
        onNodeWithAni(btn_leave, CLICK, (e: Event) => {
            const lang = getLang();
            const { leaveTip } = InternationalTip[lang];

            e.stopPropagation();
            AlertPop.alert(leaveTip).then((type) => {
                if (type === 'confirm') {
                    this.sendToGameSocket(ServerEvent.RoomOut);
                }
            });
        });
    }
    public needUpSideDown(server_index: number) {
        return server_index > 1;
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
                new FishCtrl(fish_view, fish, this);
            },
            this,
        );
        event.on(
            GameEvent.AddPlayer,
            (player: PlayerModel) => {
                const { server_index, is_cur_player } = player;
                if (is_cur_player) {
                    if (this.needUpSideDown(server_index)) {
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
                const normal_player_com = new NormalPlayerCom(player, this);
                ctrl.addCom(normal_player_com);
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
    public sendToGameSocket(...params: Parameters<WebSocketTrait['send']>) {
        const socket = getSocket(ServerName.Game);
        socket?.send(...params);
    }
    public offGameSocket() {
        const socket = getSocket(ServerName.Game);
        offCommon(socket, this);
    }
    public getSocket() {
        return getSocket(ServerName.Game);
    }
    public onEnterGame(data: ReturnType<typeof convertEnterGame>) {
        const { model, view } = this;
        const {
            isTrial,
            fish,
            users,
            frozen,
            frozen_left,
            fish_list,
            exchange_rate,
            currency,
        } = data;

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
    public activeSkill(skill: SkillMap, data: SkillActiveData) {
        this.model.activeSkill(skill, data);
    }
    public disableSkill(skill: SkillMap, user_id: string) {
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
            this.model.addPlayer(player, this.needUpSideDown);
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
            const timeout_tip =
                InternationalTip[lang][ServerErrCode.TrialTimeGame];
            const tip = isTimeOut ? timeout_tip : kickedTip;
            disableAllUserOperation();
            this.offGameSocket();
            disconnectSocket(ServerName.Game);
            AlertPop.alert(tip, {
                hide_cancel: true,
            }).then(() => {
                this.roomOut({ userId });
            });
        } else {
            const player = model.getPlayerById(userId);
            if (!player) {
                return error(
                    `Game:>captureFish:> cant find player for userId=${userId}!`,
                );
            }
            player.destroy();
        }
    }
    public roomOut(data: RoomOutRep) {
        const { model } = this;
        const { userId } = data;
        if (isCurUser(userId)) {
            this.offGameSocket();
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
