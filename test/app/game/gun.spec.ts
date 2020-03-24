import { injectProto } from 'honor/utils/tool';
import { Test } from 'testBuilder';
import GunBoxView from 'view/scenes/game/gunBoxView';

export const gun_test = new Test('gun', runner => {
    injectProto(GunBoxView, 'onAwake', item => {
        (window as any).gun_view = item;
    });
});
