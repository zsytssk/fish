import { Observable, Subscriber } from 'rxjs';
import { SpriteInfo } from 'data/sprite';
import honor, { HonorScene } from 'honor';
import { createSkeleton } from 'honor/utils/createSkeleton';
import { ui } from 'ui/layaMaxUI';
import { createSprite, getSpriteInfo } from 'utils/dataUtil';
import { playSkeleton } from 'utils/utils';
import { viewState } from '../../viewState';
import { FishView, FishViewInfo } from './fishView';
import GunBoxView from './gunBoxView';
import SkillItemView from './skillItemView';

const exchange_rate_tpl = `<div style="width: 192px;height: 32px;line-height:32px;font-size: 20px;color:#fff;align:center;"><span>1 $0</span> = <span color="#ffdd76">$1</span> <span>$2</span> </div>`;
export type BulletBoxPos = 'left' | 'right';
export default class GameView extends ui.scenes.game.gameUI
    implements HonorScene {
    /** 玩家index>2就会在上面, 页面需要上下颠倒过来... */
    public upside_down: boolean;
    private fish_click_observer: Subscriber<string>;
    public static async preEnter() {
        const game = (await honor.director.runScene(
            'scenes/game/game.scene',
            '参数1',
            '参数2',
        )) as GameView;
        viewState.game = game;
        viewState.ani_wrap = game.ani_wrap;
        return game;
    }
    public onResize(width: number, height: number) {
        const { width: tw, height: th } = this;
        this.x = (width - tw) / 2;
        this.y = (height - th) / 2;
    }
    /** 玩家index>2就会在上面, 页面需要上下颠倒过来... */
    public upSideDown() {
        const { pool, gun_wrap, ani_wrap } = this;
        pool.scaleY = gun_wrap.scaleY = ani_wrap.scaleY = -1;
        this.upside_down = true;
    }
    public addFish(info: FishViewInfo & { horizon_turn: boolean }) {
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
        let bullet: Laya.Skeleton;
        if (!rage) {
            bullet = createSkeleton(path);
        } else {
            bullet = createSkeleton(`${path}_rage`);
        }
        pool.addChild(bullet);
        bullet.visible = false;
        return bullet;
    }
    public addNet(skin: string) {
        const { pool } = this;
        const net = createSprite('net', skin);
        pool.addChild(net);
        return net;
    }
    /** 获取点击pool中的位置 */
    public onPoolClick(): Promise<Point> {
        return new Promise((resolve, reject) => {
            const { pool } = this;
            pool.once(Laya.Event.CLICK, pool, (e: Laya.Event) => {
                e.stopPropagation();
                const { x, y } = pool.getMousePoint();

                resolve({
                    x,
                    y,
                });
            });
        });
    }
    /** 获取点击pool中的位置 */
    public onFishClick(): Observable<string> {
        this.offFishClick();
        return new Observable(subscriber => {
            const { pool } = this;
            const fun = (e: Laya.Event) => {
                e.stopPropagation();
                const { target } = e;
                if (target instanceof FishView) {
                    subscriber.next(target.info.id);
                }
            };
            subscriber.add(() => {
                pool.off(Laya.Event.CLICK, pool, fun);
            });
            pool.on(Laya.Event.CLICK, pool, fun);
            this.fish_click_observer = subscriber;
        }) as Observable<string>;
    }
    /** 获取点击pool中的位置 */
    public offFishClick() {
        const { fish_click_observer: click_fish_observer } = this;
        if (click_fish_observer) {
            click_fish_observer.complete();
        }
    }
    public addGun() {
        const { gun_wrap } = this;
        const gun = new GunBoxView();
        gun_wrap.addChild(gun);
        return gun;
    }
    public setBulletNum(num: number) {
        const { bullet_num } = this;
        bullet_num.text = `剩余子弹: ` + num;
    }
    public getSkillItemByIndex(index: number) {
        return this.skill_box.skill_list.getChildAt(index) as SkillItemView;
    }
    public getAutoLaunchSkillItem() {
        return this.skill_box.auto_launch;
    }
    public setExchangeRate(rate: number, currency: string) {
        const { exchange_rate } = this;
        exchange_rate.innerHTML = exchange_rate_tpl
            .replace('$0', '子弹')
            .replace('$1', rate + '')
            .replace('$2', currency);
    }
    public setEnergyRadio(radio: number) {
        const { energy_bar } = this.skill_box;
        let { mask } = energy_bar;
        const { width, height } = energy_bar;
        if (!mask) {
            mask = new Laya.Sprite();
            energy_bar.mask = mask;
        }
        energy_bar.mask.graphics.clear();
        energy_bar.mask.graphics.drawRect(0, 0, width * radio, height, '#fff');
    }
    public energyLight() {
        const { energy_light } = this.skill_box;
        return new Promise((resolve, reject) => {
            energy_light.visible = true;
            energy_light.on(Laya.Event.STOPPED, energy_light, () => {
                energy_light.visible = false;
                resolve();
            });
            playSkeleton(energy_light, 0, false);
        });
    }
    /**  设置子弹box的位置 */
    public setBulletBoxPos(pos: BulletBoxPos) {
        const { bullet_box, bullet_box_bg } = this;
        if (pos === 'left') {
            bullet_box.right = undefined;
            bullet_box.left = -30;
            bullet_box_bg.scaleX = 1;
        } else if (pos === 'right') {
            bullet_box.right = -30;
            bullet_box.left = undefined;
            bullet_box_bg.scaleX = -1;
        }
    }
    public getPoolMousePos() {
        const { pool } = this;
        return pool.getMousePoint();
    }
}
