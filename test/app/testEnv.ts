import { game_test } from './game/game.spec';
import { mock_web_socket_test } from './socket/mockSocket/mockWebsocket.spec';
import { ServerEvent } from 'data/serverEvent';

export function localTest() {
    mock_web_socket_test.runTest('create');
    game_test.runTest('enter_game', [true]);

    mock_web_socket_test.runTest(ServerEvent.Shoot);
}

export function localAndSocketTest() {
    game_test.runTest('enter_game');
}
