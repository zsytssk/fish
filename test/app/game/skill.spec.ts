import { modelState, getAimFish } from 'model/modelState';
import { Test } from 'testBuilder';
import { fish_test } from './fish.spec';
import { player_test } from './player.spec';
import { viewState } from 'view/viewState';
import SkillItem from 'view/scenes/game/skillItemView';
import { startCount } from 'utils/count';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { sleep } from '../../utils/testUtils';
import { getBeBombFish } from 'model/game/fish/fishModelUtils';

/** 技能的测试 */
export const skill_test = new Test('skill', runner => {
    runner.describe('auto_shoot', () => {
        const player_id = modelState.app.user_info.user_id;
        player_test.runTest('add_player');
        const player = modelState.app.game.getPlayerById(player_id);
        player.gun.autoShoot.active();

        setTimeout(() => {
            player.gun.autoShoot.clear();
        }, 5000);
    });

    runner.describe('auto_bomb', async () => {
        const socket = getSocket(ServerName.Game);
        const pos = { x: 939, y: 348 };
        const fish_old_list = [...modelState.app.game.fish_list].map(item => {
            return item.id;
        });
        await sleep(5);
        const fish_new_list = [...modelState.app.game.fish_list].map(item => {
            return item.id;
        });
        const fish_list = fish_old_list.filter(item => {
            return fish_new_list.indexOf(item) === -1;
        });
        // const fish_list = getBeBombFish(pos);
        socket.send(ServerEvent.UseBomb, {
            bombPoint: pos,
            fishList: [...fish_list],
            // fishList: [...fish_list],
        } as UseBombReq);
    });

    runner.describe('track_fish_socket', async () => {
        const socket = getSocket('game');
        let fish = getAimFish();
        socket.event.emit(
            ServerEvent.UseLock,
            {
                userId: modelState.app.user_info.user_id,
                count: 1,
                duration: 10000,
                lockedFish: fish.id,
            },
            200,
        );
        await sleep(2);
        fish = getAimFish();
        socket.event.emit(
            ServerEvent.LockFish,
            {
                userId: modelState.app.user_info.user_id,
                eid: fish.id,
            },
            200,
        );
    });

    runner.describe('track_fish', () => {
        const player_id = modelState.app.user_info.user_id;
        fish_test.runTest('add_fish');
        player_test.runTest('add_player');
        const player = modelState.app.game.getPlayerById(player_id);
        /** 提示锁定不攻击 */
        setTimeout(() => {
            const fish = [...modelState.app.game.fish_list][0];
            player.gun.trackFish.track(fish, false);
        }, 1000);

        /** 锁定+攻击 */
        setTimeout(() => {
            const fish = [...modelState.app.game.fish_list][0];
            player.gun.trackFish.track(fish, true);
        }, 3000);

        /** 取消锁定 */
        setTimeout(() => {
            const fish = [...modelState.app.game.fish_list][0];
            player.gun.trackFish.unTrack();
        }, 7000);
    });

    runner.describe('speed_up', () => {
        const player_id = modelState.app.user_info.user_id;
        fish_test.runTest('add_fish');
        player_test.runTest('add_player');
        const player = modelState.app.game.getPlayerById(player_id);
        player.gun.toggleSpeedUp(true);

        setTimeout(() => {
            player.gun.toggleSpeedUp(false);
        }, 5000);
    });

    runner.describe('freezing', () => {
        fish_test.runTest('add_fish');

        setTimeout(() => {
            const { id } = [...modelState.app.game.fish_list][0];
            modelState.app.game.freezing_com.freezing(5, [id]);
        }, 5000);
    });

    runner.describe('ui_set_num', () => {
        const skill_item = viewState.game.skill_box.skill_list.getChildAt(
            0,
        ) as SkillItem;
        skill_item.setId('2');
        skill_item.setNum(2);
        startCount(10, 0.1, (t: number) => {
            skill_item.showCoolTime(1 - t);
        });
    });
    runner.describe('ui_set_num2', () => {
        const skill_item = viewState.game.skill_box.skill_list.getChildAt(
            0,
        ) as SkillItem;
        skill_item.showCoolTime(0.5);
        setTimeout(() => {
            skill_item.showCoolTime(1);
        }, 1000);
    });
    runner.describe('energy', () => {
        const game_view = viewState.game;
        startCount(10, 0.1, (t: number) => {
            game_view.setEnergyRadio(1 - t);
            if (1 - t === 1) {
                game_view.energyLight().then(() => {
                    skill_test.runTest('energy');
                });
            }
        });
    });

    runner.describe('skillItemView', () => {});
});
