import { injectProto } from 'honor/utils/tool';
import { Test } from 'testBuilder';
import GunBoxView from 'view/scenes/game/gunBoxView';

const gun_view_list = [];
(window as any).gun_view_list = gun_view_list;
export const gun_box_view_test = new Test('gun', runner => {
    injectProto(GunBoxView, 'onAwake', item => {
        gun_view_list.push(item);
    });
});
