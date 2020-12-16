import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from 'data/audioRes';
import { Sprite } from 'laya/display/Sprite';
import { Event } from 'laya/events/Event';
import { Handler } from 'laya/utils/Handler';
import { getUserInfo } from 'model/modelState';
import { onNode, isClosest } from 'utils/layaUtils';
import VoicePop from 'view/pop/voice';
import { HallCtrl } from './hallCtrl';
import { logout, login } from './login';
import { getItem, setItem } from 'utils/localStorage';
import { roomIn } from './hallSocket';
import { playSkeleton, playSkeletonOnce } from 'utils/utils';
import { getLang, recharge } from './hallCtrlUtil';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import GameRecord from 'view/pop/record/gameRecord';
import ItemRecord from 'view/pop/record/itemRecord';

export function hallViewEvent(hall: HallCtrl) {
    const { view } = hall;
    const { normal_box, match_box, header, btn_play_now } = view;
    const {
        coin_menu: { list: coin_menu_list },
        flag_menu: { list: flag_menu_list },
    } = header;

    const {
        btn_coin_select,
        btn_get,
        btn_charge,
        btn_home,
        btn_app,
        btn_leave,
        btn_voice,
        flag_box,
        btn_login,
        coin_menu,
        flag_menu,
        btn_game_record,
        btn_item_record,
        btn_recharge,
    } = header;

    coin_menu_list.selectHandler = new Handler(
        coin_menu_list,
        hall.selectCoin,
        undefined,
        false,
    );
    flag_menu_list.selectHandler = new Handler(
        coin_menu_list,
        hall.selectFlag,
        undefined,
        false,
    );

    const { CLICK } = Event;
    const normal_ani = normal_box.getChildByName('ani') as Skeleton;
    const btn_normal_try = normal_box.getChildByName('btn_try') as Sprite;
    const btn_normal_play = normal_box.getChildByName('btn_play') as Skeleton;
    const match_ani = match_box.getChildByName('ani') as Skeleton;
    const btn_match_try = match_box.getChildByName('btn_try') as Sprite;
    const btn_match_play = match_box.getChildByName('btn_play') as Sprite;

    onNode(btn_normal_play, CLICK, async (event: Event) => {
        AudioCtrl.play(AudioRes.Click);
        const lang = getLang();
        const ani = btn_normal_play.getChildByName('ani') as Skeleton;
        const ani_play = playSkeletonOnce(normal_ani, `active_${lang}`);
        const btn_play = playSkeletonOnce(ani, `active_${lang}`);

        Promise.all([btn_play, ani_play]).then(() => {
            hall.roomIn({ roomId: 1, isTrial: 0 }, hall);
            playSkeleton(ani, `standby_${lang}`, true);
        });
    });

    onNode(btn_normal_try, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        const lang = getLang();
        const ani = btn_normal_try.getChildByName('ani') as Skeleton;
        const btn_play = playSkeletonOnce(ani, `active_${lang}`);
        const ani_play = playSkeletonOnce(normal_ani, `active_${lang}`);

        Promise.all([btn_play, ani_play]).then(() => {
            hall.roomIn({ roomId: 1, isTrial: 1 }, hall);
            playSkeleton(ani, `standby_${lang}`, true);
        });
    });
    onNode(btn_match_play, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        hall.roomIn({ roomId: 2, isTrial: 0 }, hall);
    });
    onNode(btn_recharge, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        recharge();
    });
    onNode(btn_match_try, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        hall.roomIn({ roomId: 2, isTrial: 1 }, hall);
    });
    onNode(btn_play_now, CLICK, async () => {
        const lang = getLang();
        const ani = btn_play_now.getChildByName('ani') as Skeleton;
        AudioCtrl.play(AudioRes.Click);
        const ani_play = playSkeletonOnce(normal_ani, `active_${lang}`);
        const btn_play = playSkeletonOnce(ani, `active_${lang}`);
        Promise.all([btn_play, ani_play]).then(() => {
            hall.roomIn(getRoomInData(), hall);
            playSkeleton(ani, `standby_${lang}`, true);
        });
    });
    btn_coin_select.on(CLICK, hall, (event: Event) => {
        AudioCtrl.play(AudioRes.Click);
        if (isClosest(event.target, coin_menu)) {
            return;
        }
        view.toggleCoinMenu(!coin_menu.visible);
    });
    flag_box.on(CLICK, hall, (event: Event) => {
        AudioCtrl.play(AudioRes.Click);
        view.toggleFlagMenu(!flag_menu.visible);
    });
    onNode(btn_get, CLICK, () => {
        const { cur_balance, lang } = getUserInfo();
        AudioCtrl.play(AudioRes.Click);
    });
    onNode(btn_charge, CLICK, () => {
        const { cur_balance, lang } = getUserInfo();
        AudioCtrl.play(AudioRes.Click);
    });
    onNode(btn_home, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
    });
    onNode(btn_app, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
    });
    onNode(btn_login, CLICK, () => {
        login();
        AudioCtrl.play(AudioRes.Click);
    });
    onNode(btn_leave, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        logout();
    });
    onNode(btn_voice, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        VoicePop.preEnter();
    });
    onNode(btn_game_record, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        GameRecord.preEnter();
    });
    onNode(btn_item_record, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        ItemRecord.preEnter();
    });
}

type Data = Parameters<typeof roomIn>[0];
export function getRoomInData(): Data {
    const save_str = getItem('roomIn');
    if (save_str) {
        return JSON.parse(save_str);
    }
    return {
        roomId: 1,
        isTrial: 1,
    };
}
export function setRoomInData(data: Data) {
    setItem('roomIn', JSON.stringify(data));
}
