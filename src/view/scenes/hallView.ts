import honor from 'honor';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Box } from 'laya/ui/Box';
import { Label } from 'laya/ui/Label';
import { Handler } from 'laya/utils/Handler';
import { AccountMap } from 'model/userInfo/userInfoModel';
import { fade_in, fade_out } from 'utils/animate';
import { log } from 'utils/log';
import { playSkeleton } from 'utils/utils';
import { ui } from '../../ui/layaMaxUI';

export type CoinData = Array<{
    type: string;
    num: number;
}>;
export default class HallView extends ui.scenes.hall.hallUI {
    public static preEnter() {
        return honor.director.runScene('scenes/hall/hall.scene');
    }
    public onResize(width: number, height: number) {
        const { width: tw, height: th } = this;
        this.x = (width - tw) / 2;
        this.y = (height - th) / 2;
    }
    public onEnable() {
        const { coin_menu, flag_menu } = this.header;
        coin_menu.list.array = [];
        coin_menu.list.vScrollBarSkin = '';
        flag_menu.list.array = [];
        this.activeAni('');
        coin_menu.list.renderHandler = new Handler(
            this,
            this.coinMenuRender,
            undefined,
            false,
        );
    }
    /** 显示模式的动画... */
    public activeAni(type: string) {
        const { normal_box, match_box } = this;
        const map = new Map([
            ['normal', normal_box],
            ['match', match_box],
        ]);

        for (const [key, item] of map) {
            const ani = item.getChildByName('ani') as Skeleton;
            if (key === type) {
                playSkeleton(ani, 'active_zh', true);
            } else {
                playSkeleton(ani, 'normal_zh', true);
            }
        }
    }
    public setNickname(nickname_str: string) {
        const { nickname } = this.header;
        nickname.text = nickname_str;
    }
    public coinMenuRender(box: Box, index: number) {
        const coin_num = box.getChildByName('coin_num') as Label;
        const { coin_num: num } = this.header.coin_menu.list.array[index];
        const num_len = (num + '').length;
        let scale = 13 / (num_len * 1.1);
        scale = scale > 1 ? 1 : scale;
        coin_num.scale(scale, scale);
    }
    public setCoinData(data: AccountMap) {
        const { coin_menu } = this.header;
        const { list, bg } = coin_menu;
        const arr = [];
        for (const [type, { num, icon }] of data) {
            arr.push({
                coin_icon: icon || 'image/common/coin/BTC.png',
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
    public toggleBalanceMenu() {
        const { coin_menu } = this.header;
        if (!coin_menu.list.array.length) {
            return;
        }
        if (!coin_menu.visible) {
            // show
            coin_menu.y = 54;
            fade_in(coin_menu, 0.3);
        } else {
            // hide
            fade_out(coin_menu, 0.3);
            coin_menu.list.selectedIndex = -1;
        }
    }
    public setCurBalance(type: string, icon: string, num: number) {
        const { coin_icon, coin_name, coin_num } = this.header;
        const { normal_box, match_box } = this;
        coin_icon.skin = icon;
        coin_name.text = type.toUpperCase();
        coin_num.text = num + '';
        let scale = 10 / (coin_num.text.length * 1.08);
        scale = scale > 1 ? 1 : scale;
        coin_num.scale(scale, scale);

        const item_arr = [normal_box, match_box];
        for (const item of item_arr) {
            const item_coin_name = item.getChildByName('coin_name') as Label;
            item_coin_name.text = type.toUpperCase();
        }
    }
    public toggleFlagMenu() {
        const { flag_menu } = this.header;
        if (!flag_menu.visible) {
            // show
            fade_in(flag_menu, 0.3);
        } else {
            // hide
            fade_out(flag_menu, 0.3);
            flag_menu.list.selectedIndex = -1;
        }
    }

    public setFlag(type: string) {
        const { flag } = this.header;
        flag.skin = `image/common/flag/flag_${type}.png`;
    }
    public destroy() {
        super.destroy();
        log(`destroy`);
    }
}
