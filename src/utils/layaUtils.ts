import { Laya } from 'Laya';
import { Node } from 'laya/display/Node';
import { Observable, Subscriber } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Sprite } from 'laya/display/Sprite';
import { Event } from 'laya/events/Event';

export function onStageClick(
    node: Node,
    callback: (event?: Event) => void,
    once = false,
) {
    let once_observer: Subscriber<Event>;
    const observer = new Observable((subscriber: Subscriber<Event>) => {
        const fn = (_event: Event) => {
            subscriber.next(_event);
            once_observer = subscriber;
            if (once) {
                subscriber.complete();
            }
        };
        Laya.stage.on(Event.CLICK, node, fn);
        subscriber.add(() => {
            Laya.stage.off(Event.CLICK, node, fn);
        });
    });

    observer.subscribe((_event: Event) => {
        if (node.destroyed) {
            if (once_observer) {
                once_observer.complete();
            }
            return;
        }

        callback.call(node, _event);
    });
}

type ClickNode = Sprite & {
    is_disable: boolean;
};
/**
 * 在按钮上绑定事件, 防止多次点击事件导致
 * @param node 绑定的节点
 * @param event 绑定的事件
 * @param callback 执行函数
 * @param once 是否执行一次
 * @param throttle 间隔的时间 默认1s
 */
export function onNode(
    node: Sprite,
    event: string,
    callback: (event?: Event) => void,
    once?: boolean,
    throttle = 1000,
) {
    let once_observer: Subscriber<Event>;
    const observer = new Observable((subscriber: Subscriber<Event>) => {
        const fn = (_event: Event) => {
            /** 按钮置灰 */
            if ((node as ClickNode).is_disable === true) {
                return;
            }
            (node as ClickNode).is_disable = true;
            setTimeout(() => {
                if (node.destroyed) {
                    return;
                }
                (node as ClickNode).is_disable = false;
            }, throttle);

            subscriber.next(_event);
            once_observer = subscriber;
            if (once) {
                subscriber.complete();
            }
        };
        node.on(event, node, fn);
        subscriber.add(() => {
            node.off(event, node, fn);
        });
    });

    observer.pipe(throttleTime(throttle || 1000)).subscribe((_event: Event) => {
        if (node.destroyed) {
            if (once_observer) {
                once_observer.complete();
            }
            return;
        }

        callback(_event);
    });
}
