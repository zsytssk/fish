import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { Button } from 'laya/ui/Button';
import { Handler } from 'laya/utils/Handler';

import { ArenaGameStatus, CompetitionInfo } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import {
    arenaErrHandler,
    bindArenaHallSocket,
    getArenaSocket,
    offArenaHallSocket,
} from '@app/ctrl/hall/arenaSocket';
import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { bindSocketEvent } from '@app/ctrl/net/webSocketWrapUtil';
import { AudioRes } from '@app/data/audioRes';
import { ArenaEvent, ARENA_OK_CODE } from '@app/data/serverEvent';
import { modelState } from '@app/model/modelState';
import { ui } from '@app/ui/layaMaxUI';
import { formatDateTime } from '@app/utils/dayjsUtil';
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
    public isModal = true;
    private currency: string;
    public get zOrder() {
        return 100;
    }
    public static async preEnter(data: CompetitionInfo, currency: string) {
        const pop = (await honor.director.openDialog(
            {
                dialog: ArenaCompetitionPop,
                use_exist: true,
                stay_scene: true,
            },
            {
                beforeOpen: (pop: ArenaCompetitionPop) => {
                    pop.initData(data, currency);
                },
            },
        )) as ArenaCompetitionPop;
        AudioCtrl.play(AudioRes.PopShow);

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
                    this.initData(data, modelState.app.user_info.cur_balance);
                },
            });
        }
        onLangChange(this, () => {
            this.initLang();
        });
    }

    private initEvent() {
        const { btn_sign, btn_famous, btn_help, btn_best } = this;
        onNodeWithAni(btn_sign, Event.CLICK, () => {
            competitionSignUp().then((data) => {
                if (
                    data?.status !== ArenaGameStatus.GAME_STATUS_CLOSE &&
                    data?.status !== ArenaGameStatus.GAME_STATUS_SETTLEMENT
                ) {
                    HallCtrl.instance?.enterArena(data);
                    this.close();
                } else {
                    this.renderSignButton(data.status);

                    if (data.code !== ARENA_OK_CODE) {
                        arenaErrHandler(null, data.code);
                    }
                }
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
    public initData(data: CompetitionInfo, currency: string) {
        const { timezone_label, openTime, myScore, myRank, rankList } = this;

        this.currency = data.currency;

        // TODO-lang
        const status = data.myself.status;
        const fee = data.match.fee;
        openTime.text = `${data.match.startPeriod}-${data.match.endPeriod}`;
        timezone_label.text = tplIntr('openTime', {
            startTime: formatDateTime(data.match.startTime, 'MM.DD HH:mm'),
            endTime: `${formatDateTime(data.match.endTime, 'MM.DD HH:mm')}`,
        });
        myScore.text = data.myself.score + '';
        myRank.text = data.myself.ranking + '' || tplIntr('notInRank');

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
        const sign_status = this.renderSignButton(status, fee);

        if (currency !== data.currency) {
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
        }
    }
    private renderSignButton(status: ArenaGameStatus, fee?: number) {
        const { btn_sign, cost_label } = this;
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
        } else if (
            status === ArenaGameStatus.GAME_STATUS_FREE ||
            status === ArenaGameStatus.GAME_STATUS_SIGNUP
        ) {
            cost_label.visible = true;
            cost_label.text = tplIntr('feeStr', {
                fee,
                currency: 'USDT',
            });
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
        nickname.text = userId || '';

        if (score) {
            scoreLabel.text = tplIntr('score', { score });
        } else {
            scoreLabel.text = ``;
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
