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
import { getLang } from './hallCtrlUtil';
import { Skeleton } from 'laya/ani/bone/Skeleton';

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
    const btn_normal_try = normal_box.getChildByName('btn_try') as Sprite;
    const btn_normal_play = normal_box.getChildByName('btn_play') as Sprite;
    const btn_match_try = match_box.getChildByName('btn_try') as Sprite;
    const btn_match_play = match_box.getChildByName('btn_play') as Sprite;

    onNode(btn_normal_play, CLICK, async (event: Event) => {
        AudioCtrl.play(AudioRes.Click);
        const lang = getLang();
        const ani = btn_normal_play.getChildByName('ani') as Skeleton;
        playSkeletonOnce(ani, `active_${lang}`).then(() => {
            hall.roomIn({ roomId: 1, isTrial: 0 });
            playSkeleton(ani, `standby_${lang}`, true);
        });
    });
    onNode(btn_normal_try, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        const lang = getLang();
        const ani = btn_normal_try.getChildByName('ani') as Skeleton;
        playSkeletonOnce(ani, `active_${lang}`).then(() => {
            hall.roomIn({ roomId: 1, isTrial: 1 });
            playSkeleton(ani, `standby_${lang}`, true);
        });
    });
    onNode(btn_match_play, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        hall.roomIn({ roomId: 2, isTrial: 0 });
    });
    onNode(btn_match_try, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        hall.roomIn({ roomId: 2, isTrial: 1 });
    });
    onNode(btn_play_now, CLICK, async () => {
        const lang = getLang();
        const ani = btn_play_now.getChildByName('ani') as Skeleton;
        AudioCtrl.play(AudioRes.Click);
        playSkeletonOnce(ani, `active_${lang}`).then(() => {
            hall.roomIn(getRoomInData());
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
