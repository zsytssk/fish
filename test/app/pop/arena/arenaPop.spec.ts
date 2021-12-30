import { sleep } from '@app/utils/animate';
import { setItem } from '@app/utils/localStorage';
import ArenaCompetitionPop from '@app/view/pop/arenaCompetotion';
import ArenaGameStatus from '@app/view/pop/arenaGameStatus';
import ArenaGiftPop from '@app/view/pop/arenaGift';
import ArenaHelpPop from '@app/view/pop/arenaHelp';
import ArenaRankPop from '@app/view/pop/arenaRank';
import ArenaSettlePop from '@app/view/pop/arenaSettle';
import ArenaShopPop from '@app/view/pop/arenaShop';
import ArenaTaskTipPop from '@app/view/pop/arenaTaskTip';
import ArenaTopPlayerPop from '@app/view/pop/arenaTopPlayer';
import { arenaGenShopInfo, arenaShopList } from '@app/view/pop/popSocket';
import ArenaRewardRecordPop from '@app/view/pop/record/arenaRewardRecord';

import CompetitionInfoData from './competitionInfo.json';
import Gift1Data from './gift1.json';
import GiftData from './gift.json';
import HelpData from './help.json';
import RankData from './rank.json';
import SettleData from './settle.json';
import ShopData from './shop.json';
import TopPlayerData from './topPlayer.json';

export const arena_pop_test = {
    openCompetitionInfo: async () => {
        const pop = await ArenaCompetitionPop.preEnter('BTC');
        await sleep(2);
        pop.initData(CompetitionInfoData);
    },
    openHelp: async () => {
        setItem(`arenaGetRuleData:mode${1}`, JSON.stringify(HelpData));
        const pop = await ArenaHelpPop.preEnter('BTC');
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

        await sleep(1);
        pop.initData(Gift1Data as any);
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
    openRewardRecord: async () => {
        const pop = await ArenaRewardRecordPop.preEnter();
        await sleep(1);

        return pop;
    },
    openTaskTip: async () => {
        const pop = await ArenaTaskTipPop.tip(
            'this is a test.this is a test.this is a test.this is a test.this is a test.',
        );
        // const pop = await ArenaTaskTipPop.tip(
        //     '完成悬赏任务，有积分奖励！\n完成悬赏任务，有积分奖励积分奖励积分奖励！',
        // );
        await sleep(1);

        return pop;
    },
    openGameStatusEnd: async () => {
        await ArenaGameStatus.start();
        await sleep(1);
        await ArenaGameStatus.end();
    },
    openShop: async () => {
        const pop = await ArenaShopPop.preEnter();
        console.log(`test:>`);
        await sleep(1);
        pop.initData(arenaGenShopInfo(ShopData as any));
    },
};
