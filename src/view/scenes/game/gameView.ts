import { getLang, offLangChange, onLangChange } from 'ctrl/hall/hallCtrlUtil';
import { InternationalTip, Lang } from 'data/internationalConfig';
import { SpriteInfo } from 'data/sprite';
import honor, { HonorScene } from 'honor';
import { createSkeleton } from 'honor/utils/createSkeleton';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Sprite } from 'laya/display/Sprite';
import { Event } from 'laya/events/Event';

import { Observable, Subscriber } from 'rxjs';
import { first } from 'rxjs/operators';
import { ui } from 'ui/layaMaxUI';
import { fade_in } from 'utils/animate';
import { getSpriteInfo } from 'utils/dataUtil';
import { playSkeleton, playSkeletonOnce, setProps } from 'utils/utils';
import { createSkeletonPool } from 'view/viewStateUtils';
import { viewState } from '../../viewState';
import { FishView, FishViewInfo } from './fishView';
import GunBoxView from './gunBoxView';
import SkillItemView from './skillItemView';
import { error } from 'utils/log';

export type AddFishViewInfo = FishViewInfo & { horizon_turn: boolean };

const exchange_rate_tpl = `<div style="width: 192px;height: 32px;line-height:32px;font-size: 20px;color:#fff;align:center;"><span>1 $0</span> = <span color="#ffdd76">$1</span> <span>$2</span> </div>`;
export type BulletBoxDir = 'left' | 'right';
export default class GameView extends ui.scenes.game.gameUI
    implements HonorScene {
    /** 玩家index>2就会在上面, 页面需要上下颠倒过来... */
    public upside_down: boolean;
    private fish_click_observer: Subscriber<string>;
    private pool_click_observer: Subscriber<Point>;
    private resize_scale: number;
    private bg_num = 1;
    private bullet_box_pos: number;
    private bullet_box_dir: BulletBoxDir;
    public static async preEnter() {
        const game = (await honor.director.runScene(
            'scenes/game/game.scene',
        )) as GameView;
        const { ani_wrap, ani_overlay } = game;
        setProps(viewState, { game, ani_wrap, ani_overlay });
        return game;
    }
    public onEnable() {
        onLangChange(this, lang => {
            this.initLang(lang);
        });
    }
    private initLang(lang: Lang) {
        const { auto_shoot_txt } = this.skill_box;
        const status = this.skill_box.auto_shoot_light.visible;
        const skin_name = status ? `auto_cancel_${lang}` : `auto_${lang}`;
        auto_shoot_txt.skin = `image/international/${skin_name}.png`;
    }
    /** 设置游客样式 */
    public setTrialStyle() {
        const { btn_gift, btn_shop } = this;
        btn_gift.visible = false;
    }
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

        let scale = 1;
        if (width < 1290) {
            scale = 0.8;
        }

        this.triggerResize(scale);
    }
    /** 页面resize之后触发的重定位 */
    public triggerResize(scale: number) {
        if (scale === this.resize_scale) {
            return;
        }
        this.bullet_box_pos = scale > 0.8 ? 20 : -30;
        this.setBulletBoxPos(this.bullet_box_dir);

        this.resize_scale = scale;
        const {
            btn_gift,
            btn_voice,
            bullet_box,
            btn_leave,
            btn_help,
            btn_shop,
            skill_box,
        } = this;
        btn_leave.x = 20 * scale;
        btn_gift.x = 120 * scale;
        btn_leave.x = 20 * scale;
        btn_voice.right = 120 * scale;
        btn_help.right = 20 * scale;
        btn_voice.y = 10 * scale;

        bullet_box.scale(scale, scale);
        btn_voice.scale(scale, scale);
        btn_gift.scale(scale, scale);
        btn_leave.scale(scale, scale);
        btn_help.scale(scale, scale);
        btn_shop.scale(scale, scale);
        skill_box.scale(scale, scale);
    }
    /** 玩家index>2就会在上面, 页面需要上下颠倒过来... */
    public upSideDown() {
        const { pool, gun_wrap, ani_wrap, ani_overlay } = this;
        pool.scaleY = gun_wrap.scaleY = ani_overlay.scaleY = ani_wrap.scaleY = -1;
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
        const observable = new Observable(subscriber => {
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
    public onFishClick(once = false): Observable<string> {
        this.offFishClick();
        const observable = new Observable(subscriber => {
            const { pool } = this;
            const fun = (e: Event) => {
                e.stopPropagation();
                const { target } = e;
                if (target instanceof FishView) {
                    subscriber.next(target.info.id);
                }
            };
            subscriber.add(() => {
                pool.off(Event.CLICK, pool, fun);
            });
            pool.on(Event.CLICK, pool, fun);
            this.fish_click_observer = subscriber;
        }) as Observable<string>;

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
    public setBulletNum(num: number) {
        const lang = getLang();
        const { NumBullet } = InternationalTip[lang];
        const { bullet_num } = this;
        bullet_num.text = `${NumBullet}: ` + num;
    }
    public getSkillItemByIndex(index: number) {
        return this.skill_box.skill_list.getChildAt(index) as SkillItemView;
    }
    public getAutoShootSkillItem() {
        return this.skill_box.auto_shoot;
    }
    public setAutoShootLight(status: boolean) {
        const lang = getLang();
        this.skill_box.auto_shoot_light.visible = status;
        const skin_name = status ? `auto_cancel_${lang}` : `auto_${lang}`;
        this.skill_box.auto_shoot_txt.skin = `image/international/${skin_name}.png`;
    }
    public setExchangeRate(rate: number, currency: string) {
        const lang = getLang();
        const { bullet } = InternationalTip[lang];

        const { exchange_rate } = this;
        exchange_rate.innerHTML = exchange_rate_tpl
            .replace('$0', bullet)
            .replace('$1', rate + '')
            .replace('$2', currency);
        exchange_rate.style.font = '20px Arial';
    }
    public setEnergyRadio(radio: number) {
        const { energy_bar } = this.skill_box;
        let { mask } = energy_bar;
        const { width, height } = energy_bar;
        if (!mask) {
            mask = new Sprite();
            energy_bar.mask = mask;
        }
        energy_bar.mask.graphics.clear();
        energy_bar.mask.graphics.drawRect(0, 0, width * radio, height, '#fff');
    }
    public energyLight() {
        const { energy_light } = this.skill_box;
        return new Promise((resolve, reject) => {
            energy_light.visible = true;
            energy_light.on(Event.STOPPED, energy_light, () => {
                energy_light.visible = false;
                resolve();
            });
            playSkeleton(energy_light, 0, false);
        });
    }
    /**  设置子弹box的位置 */
    public setBulletBoxPos(pos: BulletBoxDir) {
        const { bullet_box, bullet_box_bg, bullet_box_pos } = this;
        if (pos === 'left') {
            bullet_box.right = undefined;
            bullet_box.left = bullet_box_pos;
            bullet_box_bg.scaleX = 1;
        } else if (pos === 'right') {
            bullet_box.right = bullet_box_pos;
            bullet_box.left = undefined;
            bullet_box_bg.scaleX = -1;
        }

        this.bullet_box_dir = pos;
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
            offLangChange(this);
            super.destroy();
        } catch (err) {
            error(err);
        }
    }
}
