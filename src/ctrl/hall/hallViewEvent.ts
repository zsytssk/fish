import { HallCtrl } from './hallCtrl';
import {
    coingameLogin,
    coingameCharge,
    coingameWithDraw,
    coingameHome,
    coingameApp,
} from 'coingame/coingameUtil';
import { onNode } from 'utils/utils';
import { roomIn } from './hallSocket';
import { loginOut } from './login';
import VoicePop from 'view/pop/voice';
import ShopPop from 'view/pop/shop';
import { getUserInfo } from 'model/modelState';
import { AudioCtrl } from 'ctrl/ctrlUtils/audioCtrl';
import { AudioRes } from 'data/audioRes';

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
    } = header;

    coin_menu_list.selectHandler = new Laya.Handler(
        coin_menu_list,
        hall.selectCoin,
        undefined,
        false,
    );
    flag_menu_list.selectHandler = new Laya.Handler(
        coin_menu_list,
        hall.selectFlag,
        undefined,
        false,
    );

    const { CLICK } = Laya.Event;
    const btn_normal_try = normal_box.getChildByName('btn_try') as Laya.Sprite;
    const btn_normal_play = normal_box.getChildByName(
        'btn_play',
    ) as Laya.Sprite;
    const btn_match_try = match_box.getChildByName('btn_try') as Laya.Sprite;
    const btn_match_play = match_box.getChildByName('btn_play') as Laya.Sprite;

    onNode(btn_normal_play, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        await roomIn({ roomId: 1, isTrial: 0 });
        hall.destroy();
    });
    onNode(btn_normal_try, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        await roomIn({ roomId: 1, isTrial: 1 });
        hall.destroy();
    });
    onNode(btn_match_play, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        await roomIn({ roomId: 2, isTrial: 0 });
        hall.destroy();
    });
    onNode(btn_match_try, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        await roomIn({ roomId: 2, isTrial: 1 });
        hall.destroy();
    });
    onNode(btn_play_now, CLICK, async () => {
        AudioCtrl.play(AudioRes.Click);
        await roomIn({ roomId: 1, isTrial: 0 });
        hall.destroy();
    });
    btn_coin_select.on(CLICK, hall, () => {
        AudioCtrl.play(AudioRes.Click);
        view.toggleBalanceMenu();
    });
    onNode(btn_get, CLICK, () => {
        const { cur_balance, lang } = getUserInfo();
        AudioCtrl.play(AudioRes.Click);
        coingameWithDraw(cur_balance, lang);
    });
    onNode(btn_charge, CLICK, () => {
        const { cur_balance, lang } = getUserInfo();
        AudioCtrl.play(AudioRes.Click);
        coingameCharge(cur_balance, lang);
    });
    onNode(btn_home, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        coingameHome();
    });
    onNode(btn_app, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        coingameApp();
    });
    onNode(btn_login, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        coingameLogin();
    });
    onNode(btn_leave, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        loginOut();
    });
    onNode(btn_voice, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        VoicePop.preEnter();
    });
    onNode(flag_box, CLICK, () => {
        AudioCtrl.play(AudioRes.Click);
        view.toggleFlagMenu();
    });
}
