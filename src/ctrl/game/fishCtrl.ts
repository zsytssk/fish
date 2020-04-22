import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';
import { FishEvent, FishModel, FishStatus } from 'model/game/fish/fishModel';
import { FishView } from 'view/scenes/game/fishView';
import {
    FishBombCom,
    FishBombEvent,
    FishBombInfo,
} from 'model/game/fish/fishBombCom';
import { activeExploding } from 'view/scenes/game/ani_wrap/exploding';
import { sendToGameSocket } from './gameSocket';
import { ServerEvent } from 'data/serverEvent';
import { waitFishDestroy } from 'model/game/fish/fishModelUtils';

/** 鱼的控制器 */
export class FishCtrl extends ComponentManager {
    /**
     * @param view 鱼对应的动画
     * @param model 鱼对应的model
     */
    constructor(private view: FishView, private model: FishModel) {
        super();
        this.init();
    }
    private init() {
        this.addCom(new TimeoutCom());
        this.initEvent();
    }
    private initEvent() {
        const { visible } = this.model;
        this.setVisible(visible);
        const event = this.model.event;
        const { view } = this;
        event.on(FishBombEvent.FishBomb, this.onBomb);
        event.on(FishEvent.VisibleChange, this.setVisible);
        event.on(FishEvent.Move, this.syncPos);
        event.on(FishEvent.BeCast, () => {
            view.beCastAni();
        });
        event.on(FishEvent.BeCapture, this.beCapture);
        event.on(FishEvent.StatusChange, (status: FishStatus) => {
            if (status === FishStatus.Freezed) {
                view.stopSwimAni();
            } else {
                view.playSwimAni();
            }
        });
        event.on(FishEvent.Destroy, () => {
            this.destroy();
        });
    }
    public onBomb = async (data: FishBombInfo) => {
        const { id: eid } = this.model;
        const { pos: bombPoint, fish_list, need_emit } = data;
        if (!need_emit) {
            return;
        }

        await waitFishDestroy(this.model);
        /** 在销毁的时候才发送命令给服务器 防止 将已经杀死的鱼发送给服务器 */
        const fishList = [] as string[];
        for (const fish of fish_list) {
            if (!fish.destroyed) {
                fishList.push(fish.id);
            }
        }
        activeExploding(bombPoint);
        sendToGameSocket(ServerEvent.FishBomb, {
            bombPoint,
            eid,
            fishList,
        } as FishBombReq);
    }; //tslint:disable-line
    public setVisible = (visible: boolean) => {
        this.view.setVisible(visible);
    }; //tslint:disable-line
    public syncPos = () => {
        const { view } = this;
        const { pos, velocity, horizon_turn, visible } = this.model;
        view.syncPos(pos, velocity, horizon_turn);
    }; //tslint:disable-line
    public beCapture = (handler: FuncVoid) => {
        // 被网住的逻辑
        setTimeout(() => {
            handler();
        }, 500);
    }; // tslint:disable-line
    public destroy() {
        const { view } = this;
        view.destroy();
        super.destroy();
    }
}
