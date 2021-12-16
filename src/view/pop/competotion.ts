import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { Button } from 'laya/ui/Button';
import { Handler } from 'laya/utils/Handler';

import { ArenaGameStatus, CompetitionInfo } from '@app/api/arenaApi';
import { ui } from '@app/ui/layaMaxUI';
import { onNodeWithAni } from '@app/utils/layaUtils';

import { competitionSignUp, getCompetitionInfo } from './popSocket';

export default class CompetitionPop
    extends ui.pop.arena.CompetitionInfoUI
    implements HonorDialog
{
    public isModal = true;
    public get zOrder() {
        return 100;
    }
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: CompetitionPop,
            use_exist: true,
            stay_scene: true,
        })) as CompetitionPop;

        const data = await getCompetitionInfo();
        pop.initData(data);
    }
    public onAwake() {
        this.initEvent();
    }
    private initEvent() {
        const { btn_sign } = this;
        onNodeWithAni(btn_sign, Event.CLICK, () => {
            competitionSignUp().then((data) => {});
        });
    }
    private initData(data: CompetitionInfo) {
        const { openTime, btn_sign, rankList, rankMask } = this;

        const status = data.myself.status;
        openTime.text = `${data.match.startPeriod}-${data.match.endPeriod}`;

        rankMask.graphics.drawRect(
            0,
            0,
            rankMask.width,
            rankMask.height,
            '#fff',
        );
        rankList.renderHandler = new Handler(
            this,
            this.rankListRender,
            null,
            false,
        );
        rankList.array = [1, 2, 3, 4, 5, 6];
        rankList.hScrollBarSkin = '';
        if (
            status === ArenaGameStatus.GAME_STATUS_SIGNUP_OVER ||
            status === ArenaGameStatus.GAME_STATUS_PLAYING
        ) {
            (btn_sign as Button).label = '继续游戏';
        } else if (status === ArenaGameStatus.GAME_STATUS_CLOSE) {
            (btn_sign as Button).disabled = true;
        } else if (
            status === ArenaGameStatus.GAME_STATUS_FREE ||
            status === ArenaGameStatus.GAME_STATUS_SIGNUP
        ) {
            (btn_sign as Button).label = '报名';
        }
    }
    rankListRender(box: ui.pop.arena.rankItemUI, index: number) {
        const data = this.rankList.array[index];
        const { rankLabel } = box;
        rankLabel.text = data;
    }

    public onClosed(type: CloseType) {}
    private initLang() {}
}
