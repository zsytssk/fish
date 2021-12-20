import { Test } from 'testBuilder';

import ArenaCompetitionPop from '@app/view/pop/arenaCompetotion';

const
export const arena_pop_test = {
    openCompetitionInfo: async () => {
        const pop = await ArenaCompetitionPop.preEnter();

        pop.initData();
    },
};
