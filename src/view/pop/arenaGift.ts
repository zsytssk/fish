import honor, { HonorDialog } from 'honor';
import { Event } from 'laya/events/Event';
import { Handler } from 'laya/utils/Handler';

import { GiftItem, GiftList } from '@app/api/arenaApi';
import { ui } from '@app/ui/layaMaxUI';
import { onNodeWithAni } from '@app/utils/layaUtils';

import { getSkillName } from './buyBullet';
import { arenaBuyGift, arenaGiftList } from './popSocket';

export default class ArenaGiftPop
    extends ui.pop.arenaGift.arenaGiftUI
    implements HonorDialog
{
    public isModal = true;
    private data: GiftList;
    public static async preEnter() {
        const pop = (await honor.director.openDialog({
            dialog: ArenaGiftPop,
            use_exist: true,
            stay_scene: true,
        })) as ArenaGiftPop;

        return pop;
    }
    public async onAwake() {
        this.initEvent();
    }
    private initEvent() {
        const { btn, list } = this;
        onNodeWithAni(btn, Event.CLICK, () => {
            const id = this.data.id;
            if (id) {
                arenaBuyGift(id).then(() => this.close());
            }
        });
        list.renderHandler = new Handler(
            this,
            this.listRenderHandler,
            null,
            false,
        );
    }
    public onEnable() {
        arenaGiftList().then((data) => {
            if (data) {
                this.initData(data);
            }
        });
    }
    public initData(data: GiftList) {
        this.data = data;
        const { btn, list } = this;
        btn.label = `${data.price}${data.currency}`;
        list.array = data.list;
    }
    private listRenderHandler(box: ui.pop.arenaGift.itemViewUI, index: number) {
        const { name_label, num_label, icon } = box;
        const data = this.list.array[index] as GiftItem;

        icon.skin = `image/pop/shop/icon/${data.goodsId}.png`;
        num_label.text = data.goodsNum + '';
        const name = getSkillName(data.goodsId + '');
        if (name) {
            name_label.text = `${getSkillName(data.goodsId + '')} x${
                data.goodsNum
            }`;
        } else {
            name_label.text = ``;
        }
    }
}
