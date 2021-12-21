import { sleep } from '@app/utils/animate';
import ArenaCompetitionPop from '@app/view/pop/arenaCompetotion';
import ArenaGiftPop from '@app/view/pop/arenaGift';
import ArenaHelpPop from '@app/view/pop/arenaHelp';
import ArenaRankPop from '@app/view/pop/arenaRank';
import ArenaSettlePop from '@app/view/pop/arenaSettle';
import ArenaTopPlayerPop from '@app/view/pop/arenaTopPlayer';

import CompetitionInfoData from './competitionInfo.json';
import GiftData from './gift.json';
import RankData from './rank.json';
import SettleData from './settle.json';
import TopPlayerData from './topPlayer.json';

export const arena_pop_test = {
    openCompetitionInfo: async () => {
        const pop = await ArenaCompetitionPop.preEnter();
        await sleep(2);
        pop.initData(CompetitionInfoData);
    },
    openHelp: async () => {
        const pop = await ArenaHelpPop.preEnter();
    },
    openRank: async () => {
        const pop = await ArenaRankPop.preEnter();
        await sleep(1);
        pop.initData(RankData);

        return pop;
    },
    openGift: async () => {
        const pop = await ArenaGiftPop.preEnter();
        await sleep(1);
        pop.initData(GiftData as any);

        return pop;
    },
    openSettle: async () => {
        const pop = await ArenaSettlePop.preEnter(SettleData);
        return pop;
    },
    openTopPlayer: async () => {
        const pop = await ArenaTopPlayerPop.preEnter();
        await sleep(1);

        pop.initData(TopPlayerData);
        return pop;
    },
};
