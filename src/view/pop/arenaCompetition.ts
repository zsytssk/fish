import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { Button } from 'laya/ui/Button';
import { Handler } from 'laya/utils/Handler';

import {
    ArenaGameStatus,
    ArenaStatus,
    CompetitionInfo,
} from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import {
    arenaErrHandler,
    getArenaSocket,
    offArenaHallSocket,
} from '@app/ctrl/hall/arenaSocket';
import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { bindSocketEvent, getSocket } from '@app/ctrl/net/webSocketWrapUtil';
import { AudioRes } from '@app/data/audioRes';
import { ArenaEvent, ARENA_OK_CODE, ServerName } from '@app/data/serverEvent';
import { ui } from '@app/ui/layaMaxUI';
import { sleep } from '@app/utils/animate';
import { formatUTC0DateTime } from '@app/utils/dayjsUtil';
import { onNodeWithAni } from '@app/utils/layaUtils';
import { tplIntr } from '@app/utils/utils';

import ArenaHelpPop from './arenaHelp';
import ArenaRankPop from './arenaRank';
import ArenaTopPlayerPop from './arenaTopPlayer';
import {
    arenaGetDayRanking,
    arenaGetHallOfFame,
    arenaGetRuleData,
    competitionSignUp,
} from './popSocket';
import TipPop from './tip';

export default class ArenaCompetitionPop
    extends ui.pop.arenaCompetitionInfo.arenaCompetitionInfoUI
    implements HonorDialog
{
    private currency: string;
    public get zOrder() {
        return 100;
    }
    public static async preEnter(data: CompetitionInfo, currency: string) {
        const pop = await honor.director.openDialog<ArenaCompetitionPop>(
            'pop/arenaCompetitionInfo/arenaCompetitionInfo.scene',
        );
        AudioCtrl.play(AudioRes.PopShow);
        pop.onData(data, currency);
        return pop;
    }
    public async onAwake() {
        this.initEvent();

        const socket = getArenaSocket();
        if (socket) {
            bindSocketEvent(socket, this, {
                [ArenaEvent.CompetitionInfo]: (data, code) => {
                    if (code !== ARENA_OK_CODE) {
                        return arenaErrHandler(this, code);
                    }
                    this.initData(data);
                },
            });
        }
        onLangChange(this, () => {
            this.initLang();
        });
    }

    public onData(data: CompetitionInfo, currency: string): void {
        const status = data.myself.status;
        const fee = data.match.fee;

        this.initData(data);
        const sign_status = this.renderSignButton(
            data.arenaStatus,
            status,
            fee,
        );

        if (currency !== data.currency) {
            sleep(0.5).then(() => {
                if (sign_status === 'continue') {
                    TipPop.tip(
                        tplIntr('arenaNotEndCurrency', {
                            currency1: currency,
                            currency2: data.currency,
                        }),
                    );
                } else if (sign_status === 'sign') {
                    TipPop.tip(
                        tplIntr('arenaNotSupportCurrency', {
                            currency1: currency,
                            currency2: data.currency,
                        }),
                    );
                }
            });
        }
    }

    private initEvent() {
        const { btn_sign, btn_famous, btn_help, btn_best } = this;
        onNodeWithAni(btn_sign, Event.CLICK, () => {
            competitionSignUp(this.currency).then((data) => {
                const canEnter =
                    data.status &&
                    (data.status === ArenaGameStatus.GAME_STATUS_SIGNUP_OVER ||
                        data.status === ArenaGameStatus.GAME_STATUS_PLAYING ||
                        data.status === ArenaGameStatus.GAME_STATUS_TABLE_OUT);

                if (data.code !== ARENA_OK_CODE && !canEnter) {
                    arenaErrHandler(null, data.code);
                    const socket = getSocket(ServerName.ArenaHall);
                    socket.send(ArenaEvent.CompetitionInfo, {
                        currency: this.currency,
                    });
                    return;
                }

                HallCtrl.instance?.enterArena(data);
                this.close();
            });
        });
        onNodeWithAni(btn_famous, Event.CLICK, () => {
            arenaGetHallOfFame(1).then((data) => {
                ArenaTopPlayerPop.preEnter(data);
            });
        });
        onNodeWithAni(btn_help, Event.CLICK, () => {
            arenaGetRuleData(1, this.currency).then((data) => {
                ArenaHelpPop.preEnter(data);
            });
        });
        onNodeWithAni(btn_best, Event.CLICK, () => {
            arenaGetDayRanking().then((data) => {
                ArenaRankPop.preEnter(data);
            });
        });
    }
    public initData(data: CompetitionInfo) {
        const { timezone_label, openTime, myScore, myRank, rankList } = this;

        this.currency = data.currency;

        openTime.text = data.match.startPeriod
            ? `${data.match.startPeriod}-${data.match.endPeriod}`
            : '~';
        timezone_label.text = tplIntr('openTime', {
            startTime: formatUTC0DateTime(data.match.startTime, 'MM.DD'),
            endTime: `${formatUTC0DateTime(data.match.endTime, 'MM.DD')}`,
        });
        myScore.text = data.myself.score ? data.myself.score + '' : '~';
        myRank.text = data.myself.ranking
            ? data.myself.ranking + ''
            : tplIntr('notInRank');

        rankList.renderHandler = new Handler(
            this,
            this.rankListRender,
            null,
            false,
        );

        const array = [];
        for (const [index, item] of data.champion.entries()) {
            if (index === 0) {
                array.push({ ...item, isAllTop: true });
            } else {
                array.push(item);
            }
        }
        rankList.array = array;
        rankList.hScrollBarSkin = '';
    }
    private renderSignButton(
        arena_status: ArenaStatus,
        user_status: ArenaGameStatus,
        fee?: number,
    ) {
        const { btn_sign, cost_label } = this;
        const status = calcUserStatus(arena_status, user_status);

        console.log(`test:>`, arena_status, user_status, status);
        if (
            status === ArenaGameStatus.GAME_STATUS_SIGNUP_OVER ||
            status === ArenaGameStatus.GAME_STATUS_PLAYING ||
            status === ArenaGameStatus.GAME_STATUS_TABLE_OUT
        ) {
            (btn_sign as Button).label = tplIntr('continueGame');
            cost_label.visible = false;
            btn_sign.labelPadding = '0,0,5,0';
            return 'continue';
        } else if (status === ArenaGameStatus.GAME_STATUS_CLOSE) {
            (btn_sign as Button).label = tplIntr('noStart');
            cost_label.visible = false;
            (btn_sign as Button).disabled = true;
            btn_sign.labelPadding = '0,0,5,0';
            return 'not_open';
        } else if (status === ArenaGameStatus.GAME_STATUS_SETTLEMENT) {
            (btn_sign as Button).label = tplIntr('GameEnded');
            cost_label.visible = false;
            (btn_sign as Button).disabled = true;
            btn_sign.labelPadding = '0,0,5,0';
            return 'not_open';
        } else if (
            status === ArenaGameStatus.GAME_STATUS_FREE ||
            status === ArenaGameStatus.GAME_STATUS_NO_SIGNUP
        ) {
            cost_label.visible = true;
            if (status === ArenaGameStatus.GAME_STATUS_FREE || fee === 0) {
                cost_label.text = tplIntr('feeFreeStr');
            } else {
                cost_label.text = tplIntr('feeStr', {
                    fee,
                    currency: 'USDT',
                });
            }
            (btn_sign as Button).label = tplIntr('sign');
            btn_sign.labelPadding = '0,0,15,0';
            return 'sign';
        }
    }
    private rankListRender(
        box: ui.pop.arenaCompetitionInfo.rankItemUI,
        index: number,
    ) {
        const { isAllTop, score, amount, endRanking, startRanking, userId } =
            this.rankList.array[index];
        const { rankLabel, sign, signBg, num_label, nickname, scoreLabel } =
            box;
        const rankArr = [
            tplIntr('allFirstPlace'),
            tplIntr('firstPlace'),
            tplIntr('secondPlace'),
            tplIntr('thirdPlace'),
        ];

        const isTopRank = endRanking === startRanking;
        rankLabel.text = isAllTop
            ? rankArr[0]
            : isTopRank
            ? rankArr[startRanking]
            : `${startRanking}-${endRanking}`;
        nickname.text = userId || tplIntr('noUser');

        if (score) {
            scoreLabel.text = tplIntr('score', { score });
        } else {
            scoreLabel.text = tplIntr('score', { score: '--' });
        }
        num_label.text = amount || '';
        const signSkin = isAllTop
            ? 'signTop.png'
            : isTopRank
            ? `sign${startRanking}.png`
            : null;
        if (signSkin) {
            sign.skin = `image/pop/arenaCompetitionInfo/${signSkin}`;
            sign.visible = true;
        } else {
            sign.visible = false;
        }
        const signBgSkin = isAllTop
            ? 'signBgTop.png'
            : isTopRank
            ? `signBg${startRanking}.png`
            : `signBg4.png`;
        signBg.skin = `image/pop/arenaCompetitionInfo/${signBgSkin}`;
    }

    private initLang() {
        const {
            title,
            openTimeLabel,
            myScoreLabel,
            myRankLabel,
            tip,
            btn_famous,
            btn_help,
            btn_best,
        } = this;
        title.text = tplIntr('arenaCompetitionTitle');
        openTimeLabel.text = tplIntr('arenaCompetitionSmallTip1');
        myScoreLabel.text = tplIntr('arenaCompetitionSmallTip2');
        myRankLabel.text = tplIntr('arenaCompetitionSmallTip3');
        tip.text = tplIntr('arenaCompetitionTip');
        btn_famous.label = tplIntr('arenaTopPlayerTitle');
        btn_help.label = tplIntr('arenaHelpTitle');
        btn_best.label = tplIntr('arenaRankTitle');
    }
    public destroy(destroyChild?: boolean) {
        offArenaHallSocket(this);
        super.destroy(destroyChild);
    }
}

export function calcUserStatus(
    arena_status: ArenaStatus,
    user_status: ArenaGameStatus,
) {
    if (
        arena_status !== ArenaStatus.ROOM_STATUS_ENABLE &&
        arena_status !== ArenaStatus.ROOM_STATUS_SETTLEMENT
    ) {
        return ArenaGameStatus.GAME_STATUS_CLOSE;
    }

    if (arena_status === ArenaStatus.ROOM_STATUS_SETTLEMENT) {
        return ArenaGameStatus.GAME_STATUS_SETTLEMENT;
    }
    return user_status;
}