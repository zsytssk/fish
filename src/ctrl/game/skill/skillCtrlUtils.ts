import { SkillModel } from 'model/game/skill/skillModel';
import { onPoolClick, onFishClick, offFishClick } from 'view/viewState';
import { FreezeModel } from 'model/game/skill/freezeModel';
import { BombModel } from 'model/game/skill/bombModel';
import { TrackFishModel } from 'model/game/skill/trackFishModel';
import { getSocket } from 'ctrl/net/webSocketWrapUtil';
import { ServerEvent } from 'data/serverEvent';
import { activeExploding } from 'view/scenes/game/ani_wrap/exploding';

/** 技能的激活前的处理 */
export function skillPreActiveHandler(model: SkillModel, step?: number) {
    return new Promise((resolve, reject) => {
        if (model instanceof FreezeModel) {
            // 冰冻
            const socket = getSocket('game');
            socket.send(ServerEvent.UseFreeze);
            resolve();
        } else if (model instanceof BombModel) {
            // 炸弹
            onPoolClick().then((pos: Point) => {
                const socket = getSocket('game');
                const fish_list = model.getBombFish(pos);
                socket.send(ServerEvent.UseBomb, {
                    bombPoint: pos,
                    eid: fish_list,
                } as UseBombReq);
            });
        } else if (model instanceof TrackFishModel) {
            const socket = getSocket('game');
            if (step === 0) {
                // 激活锁定
                socket.send(ServerEvent.UseLock);
            } else {
                // 选中鱼
                onFishClick().subscribe((fish_id: string) => {
                    console.log(`点击的鱼:>`, fish_id);
                    socket.send(ServerEvent.LockFish, {
                        eid: fish_id,
                    } as LockFishReq);
                });
            }
        } else {
            resolve();
        }
    });
}

/** 技能的激活的处理 */
export function skillActiveHandler(model: SkillModel, info: any) {
    return new Promise((resolve, reject) => {
        if (model instanceof TrackFishModel) {
            // 激活锁定之后 提示选中鱼 选中之后发给服务器...
            console.log('请选中你要攻击的鱼...');
            skillPreActiveHandler(model, 1);
            // ...
        } else if (model instanceof BombModel) {
            activeExploding(info as Point);
            resolve();
        }
    });
}

/** 技能的disabled处理 */
export function skillDisableHandler(model: SkillModel) {
    return new Promise((resolve, reject) => {
        if (model instanceof TrackFishModel) {
            console.log('取消选中屏幕的鱼...');
            offFishClick();
        } else {
            resolve();
        }
    });
}
