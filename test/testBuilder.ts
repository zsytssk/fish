import { app_test } from './app/app.spec';
import { arena_test } from './app/arena/arena';
import { ani_wrap } from './app/game/aniWrap.spec';
import { body_test } from './app/game/body.spec';
import { fish_test } from './app/game/fish.spec';
import { game_test } from './app/game/game.spec';
import { shoal_test } from './app/game/shoal/shoal.spec';
import { skill_test } from './app/game/skill.spec';
import { guide_test } from './app/guide/guide.spec';
import { hall_test } from './app/hall/hall.spec';
import { path_test } from './app/path.spec';
import { alert_test } from './app/pop/alert.spec';
import { arena_pop_test } from './app/pop/arenaPop.spec';
import { help_test } from './app/pop/help.spec';
import { lottery_test } from './app/pop/lottery.spec';
import { pop_test } from './app/pop/pop.spec';
import { record_test } from './app/pop/record.spec';
import { shop_test } from './app/pop/shop.spec';
import { voice_test } from './app/pop/voice.spec';
import { socket_test } from './app/socket/socket.spec';
import { web_socket_test } from './app/socket/websocket.spec';
import { skill_item_view_test } from './app/view/SkillItemView.spec';
import { gun_box_view_test } from './app/view/gunBoxView.spec';

export const test = {
    grand_prix_test: arena_test,
    game_test,
    fish_test,
    body_test,
    ani_wrap,
    skill_test,
    guide_test,
    shoal_test,
    hall_test,
    alert_test,
    help_test,
    lottery_test,
    record_test,
    pop_test,
    shop_test,
    voice_test,
    web_socket_test,
    app_test,
    socket_test,
    path_test,
    gun_box_view_test,
    skill_item_view_test,
    arena_pop_test,
};
