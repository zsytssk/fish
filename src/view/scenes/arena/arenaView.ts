import { Observable, Subscriber } from 'rxjs';
import { first } from 'rxjs/operators';

import honor, { HonorScene } from 'honor';
import { createSkeleton } from 'honor/utils/createSkeleton';
import { ProgressFn } from 'honor/utils/loadRes';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Event } from 'laya/events/Event';
import { Point as LayaPoint } from 'laya/maths/Point';
import { Image } from 'laya/ui/Image';
import { Label } from 'laya/ui/Label';
import { Ease } from 'laya/utils/Ease';

import {
    TaskFinishRes,
    TaskRefreshRes,
    TaskTriggerRes,
} from '@app/api/arenaApi';
import {
    getLang,
    offLangChange,
    onLangChange,
} from '@app/ctrl/hall/hallCtrlUtil';
import { Lang } from '@app/data/internationalConfig';
import { SpriteInfo } from '@app/data/sprite';
import { ui } from '@app/ui/layaMaxUI';
import {
    fade_in,
    fade_out,
    scale_in,
    scale_out,
    stopAni,
} from '@app/utils/animate';
import { clearCount, startCount } from '@app/utils/count';
import { getSpriteInfo } from '@app/utils/dataUtil';
import { formatTime, getChildrenByName } from '@app/utils/layaQueryElements';
import { error } from '@app/utils/log';
import {
    covertLang,
    playSkeleton,
    playSkeletonOnce,
    setProps,
    tplIntr,
} from '@app/utils/utils';
import ArenaTaskTipPop from '@app/view/pop/arenaTaskTip';
import TipPop from '@app/view/pop/tip';
import { createSkeletonPool } from '@app/view/viewStateUtils';

import { viewState } from '../../viewState';
import { showAwardCircle } from '../game/ani_wrap/award/awardBig';
import { FishView } from '../game/fishView';
import { AddFishViewInfo, FishViewClickInfo } from '../game/gameView';
import GunBoxView from '../game/gunBoxView';
import SkillItemView from '../game/skillItemView';

type PlayerType = 'current' | 'other';

export type BulletBoxDir = 'left' | 'right';
export default class ArenaView
    extends ui.scenes.arena.gameUI
    implements HonorScene
{
    /** 玩家index>2就会在上面, 页面需要上下颠倒过来... */
    public upside_down: boolean;
    private fish_click_observer: Subscriber<FishViewClickInfo>;
    private pool_click_observer: Subscriber<Point>;
    private task_arr = [];
    private bg_num = 1;
    public static async preEnter(progress: ProgressFn) {
        const game = (await honor.director.runScene(
            'scenes/arena/game.scene',
            progress,
        )) as ArenaView;
        const { ani_wrap, ani_overlay } = game;
        setProps(viewState, { game, ani_wrap, ani_overlay });
        return game;
    }
    public onEnable() {
        onLangChange(this, (lang) => {
            this.initLang(lang);
        });
    }
    private initLang(lang: Lang) {
        const {
            score_name,
            other_score_name,
            task_award_name,
            task_time_name,
        } = this;
        const { auto_shoot_txt } = this.skill_box;

        other_score_name.text = score_name.text = tplIntr('localScore');
        task_award_name.text = tplIntr('scoreAward');
        task_time_name.text = tplIntr('awardTime');
        const ani_name = covertLang(lang);
        const skin_name = `auto_${ani_name}`;
        auto_shoot_txt.skin = `image/international/${skin_name}.png`;
    }
    /** 设置游客样式 */
    public setTrialStyle() {}
    public showBubbleRefresh(bg_num?: number) {
        const { bubble_overlay, bg, bubble_wall, bubble_ani } = this;

        if (!bg_num) {
            bg_num = this.bg_num;
        }
        this.bg_num = bg_num;
        bg.skin = `image/game/normal_bg/bg${bg_num}.jpg`;
        bubble_ani.url = `image/game/bg_normal${bg_num}.sk`;
        bubble_wall.visible = false;

        bubble_overlay.visible = true;
        playSkeletonOnce(bubble_overlay, 'out').then(() => {
            bubble_overlay.visible = false;
            fade_in(bubble_wall, 300, '', 0.3);
            playSkeleton(bubble_wall, 2, true);
        });
    }
    public onResize(width: number, height: number) {
        const { width: tw, height: th, ctrl_box } = this;
        this.x = (width - tw) / 2;
        this.y = (height - th) / 2;

        if (width > 1334) {
            width = 1334;
        }
        ctrl_box.width = width;
    }

    private countId: number;
    public async showTaskPanel(taskInfo: TaskTriggerRes, showTip = true) {
        if (showTip) {
            TipPop.tip(tplIntr('taskStartTip'));
        }
        const { task_panel, task_award_num, task_time_num } = this;
        scale_in(task_panel, 300, Ease.bounceOut);
        task_award_num.text = taskInfo.award + '';

        task_time_num.text = formatTime(taskInfo.taskTime, 2);
        clearCount(this.countId);
        this.countId = startCount(taskInfo.taskTime, 1, (radio) => {
            const count_now = Math.floor(taskInfo.taskTime * radio);
            task_time_num.text = formatTime(count_now, 2);
        });

        const task_arr = [];
        const node_list = getChildrenByName(task_panel, 'task_item');
        for (const [index, item] of taskInfo.list.entries()) {
            const item_node = node_list[index];
            const node_task_name = item_node.getChildByName(
                'task_name',
            ) as Image;

            item_node.visible = true;
            const node_task_num = item_node.getChildByName('task_num') as Label;
            node_task_name.skin = `image/pop/help/fish${item.fishId}.png`;
            node_task_num.text = `0/${item.killNumber}`;
            task_arr.push(item.fishId);
        }
        this.task_arr = task_arr;
    }
    public updateTaskPanel(data: TaskRefreshRes) {
        const { task_panel } = this;
        const { list } = data;
        const node_list = getChildrenByName(task_panel, 'task_item');
        for (const item of list) {
            const index = this.task_arr.findIndex(
                (fishId) => fishId === item.fishId,
            );
            const item_node = node_list[index];
            const node_task_num = item_node.getChildByName('task_num');
            node_task_num.text = `${item.reachNumber}/${item.killNumber}`;
        }
    }
    public async taskFinish(data: TaskFinishRes) {
        const { task_panel, ani_wrap } = this;
        this.hideTaskPanel();

        const node_list = getChildrenByName(task_panel, 'task_item');
        for (const item_node of node_list) {
            item_node.visible = false;
        }
        if (!data.isComplete) {
            return;
        }
        const { width, height } = task_panel;
        let pos = task_panel.localToGlobal(
            new LayaPoint(width / 2, height / 2),
            true,
        );
        pos = ani_wrap.globalToLocal(pos, true);
        TipPop.tip(tplIntr('taskCompletedTip', { score: data.award }));
        await showAwardCircle(pos, data.award, true);
    }
    public async hideTaskPanel() {
        clearCount(this.countId);
        const { task_panel } = this;
        if (task_panel.visible) {
            scale_out(task_panel, 300, Ease.bounceOut);
        }
    }

    /** 玩家index>2就会在上面, 页面需要上下颠倒过来... */
    public upSideDown() {
        const { pool, gun_wrap, ani_wrap, ani_overlay } = this;
        pool.scaleY =
            gun_wrap.scaleY =
            ani_overlay.scaleY =
            ani_wrap.scaleY =
                -1;
        this.upside_down = true;
    }
    public addFish(info: AddFishViewInfo) {
        const { pool, upside_down } = this;
        const { horizon_turn } = info;
        const fish = new FishView(info, pool);
        /** 水平翻转移动的鱼需要垂直颠倒 */
        if (horizon_turn && upside_down) {
            fish.scaleY = -1;
        }
        pool.addChild(fish);
        return fish;
    }
    public addBullet(skin: string, rage = false) {
        const { pool } = this;
        const { path } = getSpriteInfo('bullet', skin) as SpriteInfo;
        let bullet: Skeleton;
        if (!rage) {
            bullet = createSkeletonPool('bullet', skin) as Skeleton;
        } else {
            bullet = createSkeleton(`${path}_rage`);
        }
        pool.addChild(bullet);
        bullet.visible = false;
        return bullet;
    }
    public addNet(skin: string) {
        const { pool } = this;
        const net = createSkeletonPool('net', skin);
        pool.addChild(net);
        return net;
    }
    /** 获取点击pool中的位置 */
    public onPoolClick(once = false): Observable<Point> {
        this.offPoolClick();
        const observable = new Observable((subscriber) => {
            const { pool } = this;
            const fun = (e: Event) => {
                const { x, y } = pool.getMousePoint();
                e.stopPropagation();
                subscriber.next({ x, y });
            };
            subscriber.add(() => {
                pool.off(Event.CLICK, pool, fun);
            });
            pool.on(Event.CLICK, pool, fun);
            this.pool_click_observer = subscriber;
        }) as Observable<Point>;

        if (once) {
            return observable.pipe(first());
        } else {
            return observable;
        }
    }
    /** 获取点击pool中的位置 */
    public offPoolClick() {
        const { pool_click_observer } = this;
        if (pool_click_observer) {
            pool_click_observer.unsubscribe();
            this.pool_click_observer = undefined;
        }
    }

    /** 获取点击pool中的位置 */
    public onFishClick(once = false): Observable<FishViewClickInfo> {
        this.offFishClick();
        const observable = new Observable((subscriber) => {
            const { pool } = this;
            const fun = (e: Event) => {
                e.stopPropagation();
                const { target } = e;
                if (target instanceof FishView) {
                    const { id, group_id } = target.info;
                    subscriber.next({ id, group_id });
                }
            };
            subscriber.add(() => {
                pool.off(Event.CLICK, pool, fun);
            });
            pool.on(Event.CLICK, pool, fun);
            this.fish_click_observer = subscriber;
        }) as Observable<FishViewClickInfo>;

        if (once) {
            return observable.pipe(first());
        } else {
            return observable;
        }
    }
    /** 获取点击pool中的位置 */
    public offFishClick() {
        const { fish_click_observer } = this;
        if (fish_click_observer) {
            fish_click_observer.unsubscribe();
            this.fish_click_observer = undefined;
        }
    }
    public addGun() {
        const { gun_wrap } = this;
        const gun = new GunBoxView();
        gun_wrap.addChild(gun);
        return gun;
    }
    public setScorePanelVisible(is_cur_player: boolean, visible: boolean) {
        const panel = is_cur_player
            ? this.my_score_panel
            : this.other_score_panel;

        stopAni(panel).then(() => {
            if (visible) {
                fade_in(panel, 200);
            } else {
                fade_out(panel, 200);
            }
        });
    }
    public setBulletScoreNum(
        is_cur_player: boolean,
        bullet_num: number,
        score_num: number,
    ) {
        const panel = is_cur_player
            ? this.my_score_panel
            : this.other_score_panel;

        const bullet_num_label = panel.getChildByName('bullet_num') as Label;
        const score_num_label = panel.getChildByName('score_num') as Label;
        bullet_num_label.text = `${tplIntr('NumBullet')}: ${bullet_num}`;
        score_num_label.text = score_num + '';
    }
    public getSkillItemByIndex(index: number) {
        return this.skill_box.skill_list.getChildAt(index) as SkillItemView;
    }
    public getAutoShootSkillItem() {
        return this.skill_box.auto_shoot;
    }
    public setAutoShootLight(status: boolean) {
        const lang = getLang();
        const ani_name = covertLang(lang);

        this.skill_box.auto_shoot_light.visible = status;
        const skin_name = status
            ? `auto_cancel_${ani_name}`
            : `auto_${ani_name}`;
        this.skill_box.auto_shoot_txt.skin = `image/international/${skin_name}.png`;
    }
    public getPoolMousePos() {
        const { pool } = this;
        return pool.getMousePoint();
    }
    public destroy() {
        /** 在游戏中 突然修改代码 无法避免会报错（大厅骨骼动画销毁报错， 应该是还没有初始化）
         *  在这里放一个try catch防止卡死
         */
        try {
            clearCount(this.countId);
            offLangChange(this);
            super.destroy();
        } catch (err) {
            error(err);
        }
    }
}
