import { ComponentManager } from 'comMan/component';
import { TimeoutCom } from 'comMan/timeoutCom';

import { ServerEvent } from '@app/data/serverEvent';
import { FishBombEvent, FishBombInfo } from '@app/model/game/fish/fishBombCom';
import {
    FishEvent,
    FishModel,
    FishStatus,
} from '@app/model/game/fish/fishModel';
import { waitFishDestroy } from '@app/model/game/fish/fishModelUtils';
import { FishView } from '@app/view/scenes/game/fishView';

import { GameCtrlUtils } from './gameCtrl';

/** 鱼的控制器 */
export class FishCtrl extends ComponentManager {
    /**
     * @param view 鱼对应的动画
     * @param model 鱼对应的model
     */
    constructor(
        private view: FishView,
        private model: FishModel,
        private game_ctrl: GameCtrlUtils,
    ) {
        super();
        this.init();
    }
    private init() {
        const { visible } = this.model;
        this.addCom(new TimeoutCom());
        this.initEvent();

        this.setVisible(visible);
        this.syncPos();
    }
    private initEvent() {
        const event = this.model.event;
        const { view } = this;
        event.on(FishBombEvent.FishBomb, this.onBomb, this);
        event.on(FishEvent.VisibleChange, this.setVisible, this);
        event.on(FishEvent.Move, this.syncPos);
        event.on(
            FishEvent.BeCast,
            () => {
                view.beCastAni();
            },
            this,
        );
        event.on(FishEvent.BeCapture, this.beCapture, this);
        event.on(
            FishEvent.StatusChange,
            (status: FishStatus) => {
                if (status === FishStatus.Freezed) {
                    view.stopSwimAni();
                } else {
                    view.playSwimAni();
                }
            },
            this,
        );
        event.on(
            FishEvent.Destroy,
            () => {
                this.destroy();
            },
            this,
        );
    }
    public onBomb = async (data: FishBombInfo) => {
        const { model, game_ctrl } = this;
        const { id: eid } = model;
        const { pos: bombPoint, fish_list, player } = data;
        const { need_emit, is_cur_player } = player;
        if (!need_emit) {
            return;
        }

        await waitFishDestroy(model);
        /** 在销毁的时候才发送命令给服务器 防止 将已经杀死的鱼发送给服务器 */
        const fishList = [] as string[];
        for (const fish of fish_list) {
            if (!fish.destroyed) {
                fishList.push(fish.id);
            }
        }
        const res_data = {
            bombPoint,
            eid,
            fishList,
        } as FishBombReq;
        if (!is_cur_player) {
            res_data.robotId = player.user_id;
        }
        game_ctrl.sendToGameSocket(ServerEvent.FishBomb, res_data);
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
        this.model?.event?.offAllCaller(this);
        view.destroy();
        super.destroy();

        this.game_ctrl = undefined;

        this.model = undefined;
    }
}
