import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { Handler } from 'laya/utils/Handler';

import { GiftItem, GiftList } from '@app/api/arenaApi';
import { AudioCtrl } from '@app/ctrl/ctrlUtils/audioCtrl';
import { onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { AudioRes } from '@app/data/audioRes';
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
    public isModal = true;
    private data: GiftList;
    public static async preEnter() {
        const pop = (await honor.director.openDialog(
            {
                dialog: ArenaGiftPop,
                use_exist: true,
                stay_scene: true,
            },
            {
                beforeOpen: (pop: ArenaGiftPop) => {
                    arenaGiftList().then((data) => {
                        if (data) {
                            pop.initData(data);
                        }
                    });
                },
            },
        )) as ArenaGiftPop;
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
                arenaBuyGift().then(() => {
                    TipPop.tip(tplIntr('buySuccess'));
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
        const { btn, list } = this;
        btn.label = `${data.price}${data.currency}`;
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
        const { name_label, num_label, icon } = box;
        const data = this.list.array[index] as GiftItem;

        icon.skin = `image/pop/shop/icon/${data.itemId}.png`;
        num_label.text = data.num + '';
        const name = getItemName(data.itemId + '');
        if (name) {
            name_label.text = `${getItemName(data.itemId + '')} x${data.num}`;
        } else {
            name_label.text = ``;
        }
    }
}
