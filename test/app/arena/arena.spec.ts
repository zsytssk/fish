import { testBuild } from 'testBuilder';

import { injectAfter } from 'honor/utils/tool';

import { ctrlState } from '@app/ctrl/ctrlState';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { GameCtrl as ArenaCtrl } from '@app/ctrl/game/gameArena/gameCtrl';
import { HallCtrl } from '@app/ctrl/hall/hallCtrl';
import { AudioRes } from '@app/data/audioRes';
import { modelState } from '@app/model/modelState';
import { sleep } from '@app/utils/animate';
import ArenaView from '@app/view/scenes/arena/arenaView';
import { viewState } from '@app/view/viewState';

import { game_test } from '../game/game.spec';
import { player_test } from '../game/player.spec';
import { afterHallEnter } from '../hall/hall.spec';
import statusData from './data/statusData.json';
import taskData from './data/taskData.json';

export const arena_test = testBuild({
    status: async () => {
        modelState.app.arena_info.updateInfo(statusData.status1);
    },
    enter: async () => {
        if (modelState?.game) {
            return;
        }

        await afterHallEnter();

        await ctrlState.app.enterArenaGame({});

        await sleep(1);

        if (modelState.game) {
            modelState.game.setGameMode(2);
        }
    },
    showTask: async () => {
        await arena_test.enter();
        const arena_ctrl = ctrlState.game as ArenaCtrl;

        arena_ctrl.triggerTask(taskData.triggerTask as any);
        await sleep(3);
        arena_ctrl.taskRefresh(taskData.taskRefresh1 as any);
        await sleep(3);
        arena_ctrl.taskRefresh(taskData.taskRefresh2 as any);
        await sleep(3);
        arena_ctrl.taskFinish({
            ...taskData.taskFinish,
            userId: modelState.app.arena_info.user_id,
        });
    },
    setPlayerNum: async () => {
        const game = viewState.game as ArenaView;
        game.setScorePanelVisible(false, true);
        await sleep(1);
        game.setBulletScoreNum(false, 1000, 100);
        await sleep(1);
        game.setScorePanelVisible(false, false);
    },
});
