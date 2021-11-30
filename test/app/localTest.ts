import { Laya } from 'Laya';
import honor from 'honor';
import { injectAfter } from 'honor/utils/tool';

import { Config } from '@app/data/config';
import { Lang } from '@app/data/internationalConfig';
import { ServerEvent } from '@app/data/serverEvent';
import { modelState } from '@app/model/modelState';
import { getParams } from '@app/utils/utils';

import { test_data } from '../testData';
import { sleep } from '../utils/testUtils';
import { body_test } from './game/body.spec';
import { fish_test } from './game/fish.spec';
import { game_test } from './game/game.spec';
import { player_test } from './game/player.spec';
import { shoal_test } from './game/shoal/shoal.spec';
import { skill_test } from './game/skill.spec';
import { mock_web_socket_test } from './socket/mockSocket/mockWebsocket.spec';

export async function localTest() {
    commonTest();
    await mock_web_socket_test.runTest('create');
    modelState.app.user_info.setUserId(test_data.userId);
    mock_web_socket_test.runTest(ServerEvent.Shoot);
    // mock_web_socket_test.runTest(ServerEvent.Hit);
    // mock_web_socket_test.runTest(ServerEvent.FishBomb);
    // mock_web_socket_test.runTest(ServerEvent.UseBomb);
    // mock_web_socket_test.runTest(ServerEvent.UseLock);
    // mock_web_socket_test.runTest(ServerEvent.UseFreeze);
    game_test.runTest('enter_game', [true]).then(() => {
        // fish_test.runTest('add_fish');
        // sleep(0.5).then(() => {
        //     player_test.runTest('add_cur_player');
        // });
        // player_test.runTest('add_other_player', [2]);
        // player_test.runTest('add_other_player', [3]);
        // fish_test.runTest('fish_view');
        // fish_test.runTest('fish_shadow');
        // fish_test.runTest('add_fish_group');
        // body_test.runTest('show_shape');

        sleep(0.5).then(() => {
            shoal_test.runTest('add_shoal1');
            player_test.runTest('add_cur_player');
        });
        // skill_test.runTest('track_fish');
    });
}

export async function localSocketTest() {
    commonTest();

    /** 直接进入房间 */
    // injectProto(HallCtrl, 'init' as any, async (hall: HallCtrl) => {
    //     const [isReplay, socketUrl] = await checkReplay(hall);
    //     if (isReplay) {
    //         ctrlState.app.enterGame(socketUrl);
    //     } else {
    //         await roomIn({ roomId: 1, isTrial: 0 });
    //     }
    //     hall.destroy();
    //     sleep(1).then(() => {
    //         honor.director.closeAllDialogs();
    //     });
    // });
}

export function commonTest() {
    injectAfter(honor, 'run', () => {
        Laya.Browser.onIOS = Laya.Browser.onAndroid = false;
        // if (location.href.indexOf('debug') === -1) {
        //     location.href += `&debug=1`;
        // }

        // record_test.runTest('open_item_record');
        const url = getParams('url');
        const code = getParams('code');
        if (url) {
            Config.SocketUrl = `ws://` + url;
        }
        if (code) {
            Config.isLogin = true;
            Config.code = code;
            Config.lang = Lang.Zh;
        }
    });
}
