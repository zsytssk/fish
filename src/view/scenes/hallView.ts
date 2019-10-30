import { ui } from '../../ui/layaMaxUI';
import honor from 'honor';
import { playSkeleton } from 'utils/utils';
import { slide_down_in, slide_up_out } from 'utils/animate';

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
        flag_menu.list.array = [];
        this.activeAni('');
    }
    /** 显示模式的动画... */
    public activeAni(type: string) {
        const { normal_box, match_box } = this;
        const map = new Map([['normal', normal_box], ['match', match_box]]);

        for (const [key, item] of map) {
            const ani = item.getChildByName('ani') as Laya.Skeleton;
            if (key === type) {
                playSkeleton(ani, 'active', true);
            } else {
                playSkeleton(ani, 'normal', true);
            }
        }
    }
    public setNickname(nickname_str: string) {
        const { nickname } = this.header;
        nickname.text = nickname_str;
    }
    public setCoinData(data: Map<string, number>) {
        const { coin_menu } = this.header;
        const { list, bg } = coin_menu;
        const arr = [];
        for (const [type, num] of data) {
            arr.push({
                coin_icon: `image/common/coin/${type}.png`,
                coin_name: type,
                coin_num: num,
            });
        }
        list.array = arr;
        coin_menu.height = bg.height = list.height = arr.length * 48 + 10;
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
    public toggleCoinMenu() {
        const { coin_menu } = this.header;
        if (!coin_menu.visible) {
            // show
            slide_down_in(coin_menu);
        } else {
            // hide
            slide_up_out(coin_menu);
            coin_menu.list.selectedIndex = -1;
        }
    }
    public setCoin(type: string, num: number) {
        const { coin_icon, coin_name, coin_num } = this.header;
        const { normal_box, match_box } = this;
        coin_icon.skin = `image/common/coin/${type}.png`;
        coin_name.text = type.toUpperCase();
        coin_num.text = num + '';

        const item_arr = [normal_box, match_box];
        for (const item of item_arr) {
            const item_coin_name = item.getChildByName(
                'coin_name',
            ) as Laya.Label;
            item_coin_name.text = type.toUpperCase();
        }
    }
    public toggleFlagMenu() {
        const { flag_menu } = this.header;
        if (!flag_menu.visible) {
            // show
            slide_down_in(flag_menu);
        } else {
            // hide
            slide_up_out(flag_menu);
            flag_menu.list.selectedIndex = -1;
        }
    }

    public setFlag(type: string) {
        const { flag } = this.header;
        flag.skin = `image/common/flag/flag_${type}.png`;
    }
}
