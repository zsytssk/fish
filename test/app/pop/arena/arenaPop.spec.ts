import { Test } from 'testBuilder';

import { sleep } from '@app/utils/animate';
import ArenaCompetitionPop from '@app/view/pop/arenaCompetotion';
import ArenaHelpPop from '@app/view/pop/arenaHelp';

import CompetitionInfoData from './competitionInfo.json';

export const arena_pop_test = {
    openCompetitionInfo: async () => {
        const pop = await ArenaCompetitionPop.preEnter();
        await sleep(2);
        pop.initData(CompetitionInfoData);
    },
    openHelp: async () => {
        const pop = await ArenaHelpPop.preEnter();
    },
};
