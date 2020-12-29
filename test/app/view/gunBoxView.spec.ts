import { injectProto } from 'honor/utils/tool';
import { Test } from 'testBuilder';
import GunBoxView from 'view/scenes/game/gunBoxView';
import { BulletCtrl } from 'ctrl/game/bulletCtrl';

const gun_view_list = [];
const scale = 1;
const y = 0;
const scale_1 = 1;
(window as any).gun_view_list = gun_view_list;
export const gun_box_view_test = new Test('gun', runner => {
    injectProto(GunBoxView, 'onAwake', item => {
        gun_view_list.push(item);

        item.body.scale(scale, scale);
        item.gun.scale(scale, scale);
        item.base.scale(scale, scale);
        item.gun.y = y;
    });

    injectProto(BulletCtrl, 'initView' as any, (item: BulletCtrl) => {
        item['view'].scale(scale_1, scale_1);
    });
});
