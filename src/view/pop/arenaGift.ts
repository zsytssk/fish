import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { Handler } from 'laya/utils/Handler';

import { GiftItem, GiftList } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
import { SkillMap } from '@app/data/config';
import { ui } from '@app/ui/layaMaxUI';
import { onNodeWithAni } from '@app/utils/layaUtils';
import { tplIntr } from '@app/utils/utils';

import { arenaBuyGift, arenaGiftList } from './popSocket';
import { getItemName } from './shop';
import TipPop from './tip';

export default class ArenaGiftPop
    extends ui.pop.arenaGift.arenaGiftUI
    implements HonorDialog
{
    private data: GiftList;
    public static async preEnter() {
        const pop = await honor.director.openDialog<ArenaGiftPop>(
            'pop/arenaGift/arenaGift.scene',
        );
        arenaGiftList().then((data) => {
            if (data) {
                pop.initData(data);
            }
        });
        AudioCtrl.play(AudioRes.PopShow);
        return pop;
    }
    public async onAwake() {
        onLangChange(this, () => {
            this.initLang();
        });
        this.initEvent();
    }

    private initLang() {
        const { title } = this;
        title.text = tplIntr('arenaGiftTitle');
    }
    private initEvent() {
        const { btn, list } = this;
        onNodeWithAni(btn, Event.CLICK, () => {
            const id = this.data.id;
            if (id) {
                arenaBuyGift()
                    .then(() => {
                        TipPop.tip(tplIntr('buySuccess'));
                        this.close();
                    })
                    .catch(() => {
                        this.close();
                    });
            }
        });
        list.renderHandler = new Handler(
            this,
            this.listRenderHandler,
            null,
            false,
        );
    }

    public initData(data: GiftList) {
        this.data = data;
        const { btn, list, btn_label } = this;

        btn_label.text = `${data.price}${data.currency}`;
        const width = btn_label.width + 50;
        btn.width = width > 161 ? width : 161;

        list.array = data.list;
        const num = data.list.length;
        list.repeatX = num;
        if (num == 4) {
            list.spaceX = 45;
        } else if (num > 4) {
            list.spaceX = 20;
        } else {
            list.spaceX = 95;
        }
        list.centerX = list.centerX === 0 ? 1 : 0;
    }
    private listRenderHandler(box: ui.pop.arenaGift.itemViewUI, index: number) {
        const { name_label, num_label, icon, btn_ques } = box;
        const data = this.list.array[index] as GiftItem;

        icon.skin = `image/pop/shop/icon/${data.itemId}.png`;
        num_label.text = data.num + '';
        const name = getItemName(data.itemId + '');

        btn_ques.offAllCaller(this);
        if (data.itemId + '' === SkillMap.Bullet) {
            btn_ques.visible = true;
            btn_ques.on(Event.CLICK, this, () => {
                TipPop.tip(tplIntr('GiftBulletTip'));
            });
        } else {
            btn_ques.visible = false;
        }
        if (name) {
            name_label.text = `${getItemName(data.itemId + '')} x${data.num}`;
        } else {
            name_label.text = ``;
        }
    }
}
