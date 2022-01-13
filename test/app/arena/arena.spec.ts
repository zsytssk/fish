import { testBuild } from 'testBuilder';

import { ctrlState } from '@app/ctrl/ctrlState';
import { GameCtrl as ArenaCtrl } from '@app/ctrl/game/gameArena/gameCtrl';
import { modelState } from '@app/model/modelState';
import { sleep } from '@app/utils/animate';
import ArenaView from '@app/view/scenes/arena/arenaView';
import { viewState } from '@app/view/viewState';

import taskData from './data/taskData.json';

export const arena_test = testBuild({
    enter: async () => {
        if (modelState?.game) {
            return;
        }

        await ctrlState.app.enterArenaGame({});

        await sleep(1);

        if (modelState.game) {
            modelState.game.setGameMode(2);
        }
    },
    showTask: async () => {
        await arena_test.enter();
        const arena_ctrl = ctrlState.game as ArenaCtrl;

        arena_ctrl.triggerTask(taskData.triggerTask);
        await sleep(3);
        arena_ctrl.taskRefresh(taskData.taskRefresh1);
        await sleep(3);
        arena_ctrl.taskRefresh(taskData.taskRefresh2);
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
