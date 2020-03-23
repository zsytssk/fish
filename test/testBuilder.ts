import { mapTest, Test } from 'testBuilder';
import { TestBuilderCtor } from 'testBuilder/testBuilder';
import { app_test } from './app/app.spec';
import { ani_wrap } from './app/game/aniWrap.spec';
import { body_test } from './app/game/body.spec';
import { fish_test } from './app/game/fish.spec';
import { game_test } from './app/game/game.spec';
import { player_test } from './app/game/player.spec';
import { skill_test } from './app/game/skill.spec';
import { hall_test } from './app/hall/hall.spec';
import { path_test } from './app/path.spec';
import { alert_test } from './app/pop/alert.spec';
import { lottery_test } from './app/pop/lottery.spec';
import { shop_test } from './app/pop/shop.spec';
import { voice_test } from './app/pop/voice.spec';
import { mock_web_socket_test } from './app/socket/mockSocket/mockWebsocket.spec';
import { socket_test } from './app/socket/socket.spec';
import { web_socket_test } from './app/socket/websocket.spec';
import { count_test } from './other/count.spec';
import { laya_test } from './other/laya.spec';
import { sat_test } from './other/sat.spec';
import { getTestEnable, getTestIgnore } from './utils/testUtils';
import { shoal_test } from './app/game/shoal/shoal.spec';
import { utils_test } from './other/utils.spec';

const testScope = new Test('top');
testScope.addChild(
    ani_wrap,
    app_test,
    body_test,
    count_test,
    fish_test,
    game_test,
    hall_test,
    path_test,
    player_test,
    sat_test,
    skill_test,
    socket_test,
    alert_test,
    web_socket_test,
    laya_test,
    shop_test,
    lottery_test,
    voice_test,
    mock_web_socket_test,
    shoal_test,
    utils_test,
);
const testBuilder = new TestBuilderCtor(testScope, { is_on: true });
testBuilder.enableDisableTest(getTestEnable(), getTestIgnore());
testBuilder.init();

export const test = mapTest(testBuilder.top_scope);
