import { sleep } from '@app/utils/animate';
import ArenaCompetitionPop from '@app/view/pop/arenaCompetotion';
import ArenaHelpPop from '@app/view/pop/arenaHelp';
import ArenaRankPop from '@app/view/pop/arenaRank';

import CompetitionInfoData from './competitionInfo.json';
import RankData from './rank.json';

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
        const pop = await ArenaRankPop.preEnter();
        await sleep(1);
        pop.initData(RankData);

        return pop;
    },
};
