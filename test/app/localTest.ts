import { ServerEvent } from 'data/serverEvent';
import { fish_test } from './game/fish.spec';
import { game_test } from './game/game.spec';
import { player_test } from './game/player.spec';
import { mock_web_socket_test } from './socket/mockSocket/mockWebsocket.spec';
import { getParams } from 'utils/utils';
import { modelState } from 'model/modelState';
import { test_data } from '../testData';
import * as main from 'main';
import { injectAfter } from 'honor/utils/tool';
import honor from 'honor';
import { Laya } from 'Laya';
import { Config } from 'data/config';
import { ani_wrap } from './game/aniWrap.spec';

export async function localTest() {
    commonTest();
    await mock_web_socket_test.runTest('create');
    modelState.app.user_info.setUserId(test_data.userId);
    mock_web_socket_test.runTest(ServerEvent.Shoot);
    // mock_web_socket_test.runTest(ServerEvent.Hit);
    mock_web_socket_test.runTest(ServerEvent.FishBomb);
    mock_web_socket_test.runTest(ServerEvent.UseBomb);
    mock_web_socket_test.runTest(ServerEvent.UseLock);
    mock_web_socket_test.runTest(ServerEvent.UseFreeze);
    game_test.runTest('enter_game', [true]).then(() => {
        fish_test.runTest('get_click_fish');
        player_test.runTest('add_cur_player');
        player_test.runTest('add_other_player', [1]);
        player_test.runTest('add_other_player', [2]);
        player_test.runTest('add_other_player', [3]);
        fish_test.runTest('bomb_other_fish');
    });
}

export async function localSocketTest() {
    commonTest();
    const code = getParams('code');
    if (code) {
        localStorage.setItem('code', code);
    }

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
        const url = getParams('url');
        const code = getParams('code');
        if (url) {
            Config.SocketUrl = url;
            Config.code = code;
            Config.isLogin = true;
        }
    });
}
