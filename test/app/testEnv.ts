import { roomIn, checkReplay } from 'ctrl/hall/hallSocket';
import { ServerEvent, ServerName } from 'data/serverEvent';
import { fish_test } from './game/fish.spec';
import { game_test } from './game/game.spec';
import { player_test } from './game/player.spec';
import { mock_web_socket_test } from './socket/mockSocket/mockWebsocket.spec';
import { waitCreateSocket } from 'ctrl/net/webSocketWrapUtil';
import { injectProto } from 'honor/utils/tool';
import { HallCtrl } from 'ctrl/hall/hallCtrl';
import { ctrlState } from 'ctrl/ctrlState';
import honor from 'honor';
import { sleep } from 'utils/animate';

export async function localTest() {
    await mock_web_socket_test.runTest('create');
    mock_web_socket_test.runTest(ServerEvent.Shoot);
    mock_web_socket_test.runTest(ServerEvent.Hit);
    mock_web_socket_test.runTest(ServerEvent.FishBomb);
    game_test.runTest('enter_game', [true]).then(() => {
        fish_test.runTest('get_click_fish');
        player_test.runTest('add_cur_player');
        fish_test.runTest('add_fish');
    });
}

export async function localHaveSocketTest() {
    /** 直接进入房间 */
    injectProto(HallCtrl, 'init' as any, async (hall: HallCtrl) => {
        const [isReplay, socketUrl] = await checkReplay(hall);
        if (isReplay) {
            ctrlState.app.enterGame(socketUrl);
        } else {
            await roomIn({ roomId: 1, isTrial: 0 });
        }
        hall.destroy();
        sleep(1).then(() => {
            honor.director.closeAllDialogs();
        });
    });
}
