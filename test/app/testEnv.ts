import { game_test } from './game/game.spec';
import { mock_web_socket_test } from './socket/mockSocket/mockWebsocket.spec';
import { ServerEvent } from 'data/serverEvent';
import { fish_test } from './game/fish.spec';
import { player_test } from './game/player.spec';

export function localTest() {
    mock_web_socket_test.runTest('create');
    mock_web_socket_test.runTest(ServerEvent.Shoot);
    mock_web_socket_test.runTest(ServerEvent.Hit);
    mock_web_socket_test.runTest(ServerEvent.FishBomb);
    game_test.runTest('enter_game', [true]).then(() => {
        fish_test.runTest('add_fish');
        player_test.runTest('add_cur_player');
    });
}

export function localHaveSocketTest() {
    // game_test.runTest('enter_game');
}
