import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { Button } from 'laya/ui/Button';
import { Handler } from 'laya/utils/Handler';

import { ArenaGameStatus, CompetitionInfo } from '@app/api/arenaApi';
import { ctrlState } from '@app/ctrl/ctrlState';
import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { ui } from '@app/ui/layaMaxUI';
import { formatDateTime } from '@app/utils/dayjsUtil';
import { onNodeWithAni } from '@app/utils/layaUtils';

import ArenaHelpPop from './arenaHelp';
import ArenaRankPop from './arenaRank';
import ArenaTopPlayerPop from './arenaTopPlayer';
import { competitionSignUp, getCompetitionInfo } from './popSocket';

export default class ArenaCompetitionPop
    extends ui.pop.arenaCompetitionInfo.arenaCompetitionInfoUI
    implements HonorDialog
{
    public isModal = true;
    public get zOrder() {
        return 100;
    }
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: ArenaCompetitionPop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaCompetitionPop;

        return pop;
    }
    public async onAwake() {
        this.initEvent();
        onLangChange(this, () => {
            this.initLang();
        });
    }
    public async onEnable() {
        const data = await getCompetitionInfo();
        if (data) {
            this.initData(data);
        }
    }
    private initEvent() {
        const { btn_sign, btn_famous, btn_help, btn_best } = this;
        onNodeWithAni(btn_sign, Event.CLICK, () => {
            competitionSignUp().then((data) => {
                if (
                    data.status !== ArenaGameStatus.GAME_STATUS_CLOSE &&
                    data.status !== ArenaGameStatus.GAME_STATUS_SETTLEMENT
                ) {
                    HallCtrl.instance?.enterArena(data);
                    this.close();
                } else {
                    this.renderSignButton(data.status);
                }
            });
        });
        onNodeWithAni(btn_famous, Event.CLICK, () => {
            ArenaTopPlayerPop.preEnter();
        });
        onNodeWithAni(btn_help, Event.CLICK, () => {
            ArenaHelpPop.preEnter();
        });
        onNodeWithAni(btn_best, Event.CLICK, () => {
            ArenaRankPop.preEnter();
        });
    }
    public initData(data: CompetitionInfo) {
        const { timezone_label, openTime, myScore, myRank, rankList } = this;

        const status = data.myself.status;
        const fee = data.match.fee;
        openTime.text = `${data.match.startPeriod}-${data.match.endPeriod}`;
        timezone_label.text = `活动时间：${formatDateTime(
            data.match.startTime,
            'MM.DD HH:mm',
        )}-${formatDateTime(data.match.endTime, 'MM.DD HH:mm')}`;
        myScore.text = data.myself.score + '';
        myRank.text = data.myself.ranking + '' || '暂未上榜';

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
        this.renderSignButton(status, fee);
    }
    private renderSignButton(status: ArenaGameStatus, fee?: number) {
        const { btn_sign, cost_label } = this;
        if (
            status === ArenaGameStatus.GAME_STATUS_SIGNUP_OVER ||
            status === ArenaGameStatus.GAME_STATUS_PLAYING ||
            status === ArenaGameStatus.GAME_STATUS_TABLE_OUT
        ) {
            (btn_sign as Button).label = '继续游戏';
            cost_label.visible = false;
            btn_sign.labelPadding = '0,0,5,0';
        } else if (status === ArenaGameStatus.GAME_STATUS_CLOSE) {
            (btn_sign as Button).label = '暂未开始';
            cost_label.visible = false;
            (btn_sign as Button).disabled = true;
            btn_sign.labelPadding = '0,0,5,0';
        } else if (
            status === ArenaGameStatus.GAME_STATUS_FREE ||
            status === ArenaGameStatus.GAME_STATUS_SIGNUP
        ) {
            cost_label.visible = true;
            cost_label.text = `费用：${fee}USDT`;
            (btn_sign as Button).label = '报名';
            btn_sign.labelPadding = '0,0,15,0';
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
        const rankArr = ['总冠军', '冠军', '亚军', '季军'];

        const isTopRank = endRanking === startRanking;
        rankLabel.text = isAllTop
            ? rankArr[0]
            : isTopRank
            ? rankArr[startRanking]
            : `${startRanking}-${endRanking}`;
        nickname.text = userId || '';

        if (score) {
            scoreLabel.text = `积分：${score}`;
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
        //
    }
}
