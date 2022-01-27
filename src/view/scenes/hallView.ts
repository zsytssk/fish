import { ArenaStatus } from '@app/api/arenaApi';
import {
    getLang,
    offLangChange,
    onLangChange
} from '@app/ctrl/hall/hallCtrlUtil';
import { Lang } from '@app/data/internationalConfig';
import { type ArenaModel } from '@app/model/arena/arenaModel';
import { AccountMap } from '@app/model/userInfo/userInfoModel';
import { fade_in, fade_out } from '@app/utils/animate';
import { formatDateRange, formatUTC0DateTime } from '@app/utils/dayjsUtil';
import { ClickNode, onStageClick, resizeContain } from '@app/utils/layaUtils';
import { error } from '@app/utils/log';
import { covertLang, playSkeleton, tplIntr } from '@app/utils/utils';
import honor, { HonorScene } from 'honor';
import { ProgressFn } from 'honor/utils/loadRes';
import { Laya } from 'Laya';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Box } from 'laya/ui/Box';
import { Image } from 'laya/ui/Image';
import { Label } from 'laya/ui/Label';
import { Handler } from 'laya/utils/Handler';
import { ui } from '../../ui/layaMaxUI';



export type CoinData = {
    type: string;
    num: number;
}[];

export default class HallView
    extends ui.scenes.hall.hallUI
    implements HonorScene
{
    public static async preEnter(progress: ProgressFn) {
        return honor.director.runScene('scenes/hall/hall.scene', progress);
    }

    public onOpened() {

        const { coin_menu, flag_menu } = this.header;
        coin_menu.list.array = [];
        // coin_menu.list.vScrollBarSkin = '';
        flag_menu.list.array = [];
        this.activeAni('normal');
        coin_menu.list.renderHandler = new Handler(
            this,
            this.coinMenuRender,
            undefined,
            false,
        );

        this.initEvent();
    }
    private initEvent() {
        const { flag_menu, btn_coin_select, flag_box } = this.header;
        onLangChange(this, (lang) => {
            this.initLang(lang);
        });
        onStageClick(
            this,
            () => {
                this.toggleCoinMenu(false);
            },
            [btn_coin_select],
        );

        onStageClick(
            this,
            () => {
                this.toggleFlagMenu(false);
            },
            [flag_menu, flag_box],
        );


    }

    public onResize(width?: number, height?: number) {
        if (!width) {
            width = Laya.stage.width;
            height = Laya.stage.height;
        }
        const {
            width: tw,
            height: th,
            inner,
            header: {
                inner: header_inner,
                middle_btn_wrap,
                btn_right_wrap,
                left_wrap,
                right_wrap,
            },
        } = this;
        this.x = (width - tw) / 2;
        this.y = (height - th) / 2;
        if (width > 1334) {
            width = 1334;
        }
        header_inner.width = inner.width = width;
        const radio = width / height;
        let space = 10 * radio * radio;
        if (width / height < 1.651) {
            space = 7 * radio * radio;
        }
        resizeContain(left_wrap, space);
        resizeContain(btn_right_wrap, space);
        resizeContain(middle_btn_wrap, space);
        resizeContain(right_wrap, space);
    }
    private initLang(lang: Lang) {
        const { arena_status, match_status,match_timezone,match_box, normal_box, btn_play_now } = this;
        const { btn_get, btn_charge, middle_btn_wrap } = this.header;
        const ani_name = covertLang(lang);

        const map = [
            ['normal', normal_box],
            ['match', match_box],
        ] as Array<[string, Box]>;

        match_timezone.text = tplIntr('stayTuned');
        arena_status.text = tplIntr('arenaTitle');
        match_status.text = tplIntr('matchTitle');

        const btn_arr = ['btn_play', 'btn_try'];
        for (const [key, item] of map) {
            const ani = item.getChildByName('ani') as Skeleton;
            playSkeleton(ani, `standby_${ani_name}`, true);
            for (const btn_item of btn_arr) {
                const btn = item.getChildByName(btn_item);
                const item_ani = btn.getChildByName('ani') as Skeleton;
                playSkeleton(item_ani, `standby_${ani_name}`, true);
            }
        }
        const play_now_ani = btn_play_now.getChildByName('ani') as Skeleton;
        playSkeleton(play_now_ani, `standby_${ani_name}`, true);

        (
            btn_charge.getChildByName('txt_label') as Image
        ).skin = `image/international/charge_${ani_name}.png`;
        (
            btn_get.getChildByName('txt_label') as Image
        ).skin = `image/international/withdraw_${ani_name}.png`;
        resizeContain(middle_btn_wrap, 10);
        this.activeAni('normal');
    }
    public setRechargeBtnVisible(visible: boolean) {
        this.header.btn_recharge.visible = visible;
        if (visible) {
            this.onResize();
        }
    }
    /** 显示模式的动画... */
    public activeAni(type: string) {
        const { normal_box, match_box } = this;
        const lang = getLang();
        const ani_name = covertLang(lang);

        const map = [
            ['normal', normal_box],
            ['match', match_box],
        ] as Array<[string, Box]>;

        for (const [key, item] of map) {
            const ani = item.getChildByName('ani') as Skeleton;
            playSkeleton(ani, `standby_${ani_name}`, true);
        }
    }
    public setNickname(nickname_str: string) {
        const { nickname, user_box, left_wrap } = this.header;
        const space = 10;
        nickname.text = honor.utils.cutStr(nickname_str, 12);
        if (nickname_str !== 'GUEST') {
            resizeContain(left_wrap, space);
            return (user_box.visible = false);
        }
        user_box.visible = true;

        onLangChange(this, () => {
            nickname.text = tplIntr('guest');
        });
        resizeContain(left_wrap, space);
    }
    public updateArenaInfo(info?: ArenaModel) {
        const {arena_timezone,  btn_competition} = this;
        const gray = btn_competition.getChildByName('gray') as Image;

        if (!info?.room_status || info?.room_status === ArenaStatus.ROOM_STATUS_MAINTAIN) {
            (btn_competition as unknown as ClickNode).is_disable = true;
            arena_timezone.text = tplIntr('maintaining')
            gray.visible = true;
            return;
        }

        const {room_status, open_timezone} = info;


        const notOpen =  room_status === ArenaStatus.ROOM_STATUS_DISABLE;
        gray.visible = notOpen;
        if (notOpen) {
            arena_timezone.text = tplIntr('noOpen');
        } else if (room_status === ArenaStatus.ROOM_STATUS_ENABLE_PREHEAT) {
            arena_timezone.text = tplIntr('preStartTime', {time: formatUTC0DateTime(open_timezone[0], 'MM/DD')})
        } else {
            arena_timezone.text = formatDateRange(open_timezone)
        }
        (btn_competition as unknown as ClickNode).is_disable = notOpen;


    }
    public coinMenuRender(box: Box, index: number) {
        const origin_width = 148;
        const coin_num = box.getChildByName('coin_num') as Label;
        const { coin_num: num } = this.header.coin_menu.list.array[index];
        const num_len = (Number(num) + '').length;
        let scale = 14 / (num_len * 1.1);
        scale = scale > 1 ? 1 : scale;
        coin_num.scale(scale, scale);
        coin_num.width = origin_width / scale;
    }
    public setCoinData(data: AccountMap) {
        const { coin_menu } = this.header;
        const { list, bg } = coin_menu;
        const arr = [];
        for (const [type, { num, icon }] of data) {
            arr.push({
                coin_icon: icon,
                coin_name: type,
                coin_num: num,
            });
        }
        list.array = arr;

        if (arr.length <= 7) {
            coin_menu.height = bg.height = list.height = arr.length * 48 + 10;
        } else {
            coin_menu.height = list.height = bg.height = 7 * 48 + 10;
        }
    }
    public setFlagData(data: string[]) {
        const { flag_menu } = this.header;
        const { list, bg } = flag_menu;
        const arr = [];
        for (const type of data) {
            arr.push({
                flag_type: type,
                flag_icon: `image/common/flag/flag_${type}.png`,
            });
        }
        list.array = arr;
        flag_menu.height = bg.height = list.height = arr.length * 61 + 20;
    }
    public toggleCoinMenu(status: boolean) {
        const { coin_menu, coin_triangle } = this.header;
        if (!coin_menu.list.array.length) {
            return;
        }
        if (status) {
            // show
            coin_menu.y = 60;
            fade_in(coin_menu, 300);
            coin_triangle.rotation = 180;
        } else {
            // hide
            fade_out(coin_menu, 100);
            coin_menu.list.selectedIndex = -1;
            coin_triangle.rotation = 0;
        }
    }
    public setCurBalance(type: string, icon: string, num: number) {
        const { coin_icon, coin_name, coin_num } = this.header;
        const { normal_box, match_box } = this;
        const origin_width = 119;
        coin_icon.skin = icon;
        coin_name.text = type.toUpperCase();
        coin_num.text = Number(num) + '';
        let scale = 11 / (coin_num.text.length * 1.08);
        scale = scale > 1 ? 1 : scale;
        coin_num.scale(scale, scale);
        coin_num.width = origin_width / scale;

        const item_arr = [normal_box, match_box];
        for (const item of item_arr) {
            const item_coin_name = item.getChildByName('coin_name') as Label;
            item_coin_name.text = type.toUpperCase();
        }
    }
    public toggleFlagMenu(status: boolean) {
        const { flag_menu, flag_triangle } = this.header;
        if (status) {
            // show
            fade_in(flag_menu, 300);
            flag_triangle.rotation = 180;
        } else {
            // hide
            fade_out(flag_menu, 100);
            flag_menu.list.selectedIndex = -1;
            flag_triangle.rotation = 0;
        }
    }

    public setFlag(type: string) {
        const { flag } = this.header;

        flag.skin = `image/common/flag/flag_${covertLang(type)}.png`;
    }
    public destroy() {
        /** 在游戏中 突然修改代码 无法避免会报错（大厅骨骼动画销毁报错， 应该是还没有初始化）
         *  在这里放一个try catch防止卡死
         */
        try {
            super.destroy();
            offLangChange(this);
        } catch (err) {
            error(err);
        }
    }
}
