import { TestBuilderCtor } from 'testBuilder/testBuilder';

import { mapTest, Test } from 'testBuilder';

import { app_test } from './app/app.spec';
import { ani_wrap } from './app/game/aniWrap.spec';
import { body_test } from './app/game/body.spec';
import { fish_test } from './app/game/fish.spec';
import { game_test } from './app/game/game.spec';
import { player_test } from './app/game/player.spec';
import { shoal_test } from './app/game/shoal/shoal.spec';
import { skill_test } from './app/game/skill.spec';
import { guide_test } from './app/guide/guide.spec';
import { hall_test } from './app/hall/hall.spec';
import { path_test } from './app/path.spec';
import { alert_test } from './app/pop/alert.spec';
import { help_test } from './app/pop/help.spec';
import { lottery_test } from './app/pop/lottery.spec';
import { pop_test } from './app/pop/pop.spec';
import { record_test } from './app/pop/record.spec';
import { shop_test } from './app/pop/shop.spec';
import { voice_test } from './app/pop/voice.spec';
import { mock_web_socket_test } from './app/socket/mockSocket/mockWebsocket.spec';
import { socket_test } from './app/socket/socket.spec';
import { web_socket_test } from './app/socket/websocket.spec';
import { skill_item_view_test } from './app/view/SkillItemView.spec';
import { gun_box_view_test } from './app/view/gunBoxView.spec';
import { count_test } from './other/count.spec';
import { laya_test } from './other/laya.spec';
import { sat_test } from './other/sat.spec';
import { utils_test } from './other/utils.spec';
import { getTestEnable, getTestIgnore } from './utils/testUtils';

const testScope = new Test('top');
testScope.addChild(
    record_test,
    ani_wrap,
    app_test,
    body_test,
    count_test,
    fish_test,
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
    gun_box_view_test,
    utils_test,
    skill_item_view_test,
    guide_test,
    help_test,
    pop_test,
);
const testBuilder = new TestBuilderCtor(testScope, { is_on: true });
testBuilder.enableDisableTest(getTestEnable(), getTestIgnore());
testBuilder.init();

export const test = mapTest(testBuilder.top_scope);
