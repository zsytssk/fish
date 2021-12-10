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
import { game_test } from './game/game.spec';
import { player_test } from './game/player.spec';
import { shoal_test } from './game/shoal/shoal.spec';
import { grand_prix_test } from './grandPrix/grandPrix.spec';
import { mock_web_socket_test } from './socket/mockSocket/mockWebsocket.spec';

export async function localTest() {
    commonTest();
    await mock_web_socket_test.create();
    modelState.app.user_info.setUserId(test_data.userId);
    (mock_web_socket_test[ServerEvent.Shoot] as () => void)();
    // mock_web_socket_test.runTest(ServerEvent.Hit);
    // mock_web_socket_test.runTest(ServerEvent.FishBomb);
    // mock_web_socket_test.runTest(ServerEvent.UseBomb);
    // mock_web_socket_test.runTest(ServerEvent.UseLock);
    // mock_web_socket_test.runTest(ServerEvent.UseFreeze);
    await grand_prix_test.enter(true);

    await sleep(0.5);
    shoal_test.addShoal1();
    player_test.add_cur_player();
    // await sleep(0.5);
    // grand_prix_test.showTask();
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
