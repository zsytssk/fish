import {
    createSkeleton,
    createImg,
    createSprite,
} from 'honor/utils/createSkeleton';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Sprite } from 'laya/display/Sprite';
import { Texture } from 'laya/resource/Texture';

import { ShadowItemInfo } from '@app/data/coordinate';
import { FishSpriteInfo } from '@app/data/sprite';
import { getCurrencyIcon } from '@app/model/userInfo/userInfoUtils';
import { getSpriteInfo, getShadowInfo } from '@app/utils/dataUtil';
import { vectorToDegree } from '@app/utils/mathUtils';
import {
    createRedFilter,
    playSkeleton,
    stopSkeleton,
    createColorFilter,
} from '@app/utils/utils';
import { viewState } from '@app/view/viewState';
import {
    createSkeletonPool,
    recoverSkeletonPool,
    createImgPool,
    recoverImgPool,
} from '@app/view/viewStateUtils';

export type FishViewInfo = {
    type: string;
    id: string;
    currency: string;
};
export class FishView extends Sprite {
    private fish_ani: Skeleton;
    private coin_light: Skeleton;
    private shadow_node: Sprite;
    public info: FishViewInfo;
    public shadow_info: ShadowItemInfo;
    private pool: Sprite;
    private time_out: number;
    private turn_ani: boolean;
    private turn_ani_name: string;
    constructor(info: FishViewInfo, pool: Sprite) {
        super();
        this.info = info;
        this.pool = pool;
        this.mouseEnabled = true;
        this.mouseThrough = false;
        this.visible = false;

        (window as any).fish = this;
    }
    /** 创建 ani and shadow */
    private initAni() {
        if (this.fish_ani) {
            return;
        }
        const { type } = this.info;
        const { offset, turn_ani } = getSpriteInfo(
            'fish',
            type,
        ) as FishSpriteInfo;
        const fish_ani = this.createFishAni();
        const [top, right, bottom, left] = offset;
        const width = right + left;
        const height = top + bottom;
        const pivot_x = left;
        const pivot_y = top;
        this.size(width, height);

        this.pivot(pivot_x, pivot_y);
        fish_ani.pos(pivot_x, pivot_y);
        this.addChild(fish_ani);
        playSkeleton(fish_ani, 0, true);
        this.fish_ani = fish_ani;
        this.turn_ani = turn_ani;
        this.initShadow();

        this.zOrder = Number(type);
    }
    private createFishAni() {
        const { type, currency } = this.info;
        const { coin_flag, coin_color, scale } = getSpriteInfo(
            'fish',
            type,
        ) as FishSpriteInfo;
        const fish_ani = createSkeletonPool(
            'fish',
            type,
            null,
            coin_flag ? 1 : undefined,
        ) as Skeleton;

        // 鱼身上添加icon的样式。。。
        if (coin_flag) {
            const coin_light = createSkeletonPool(
                'other',
                'coin_light',
            ) as Skeleton;
            coin_light.zOrder = 10;
            fish_ani.addChild(coin_light);
            coin_light.scale(1.5, 1.5);
            coin_light.alpha = 0.6;
            playSkeleton(coin_light, 0, true);

            this.coin_light = coin_light;

            const fish_icon = getCurrencyIcon(currency);
            if (fish_icon) {
                createSprite(fish_icon).then((img) => {
                    img.filters = [createColorFilter(coin_color)];
                    const texture = img.drawToTexture(
                        img.width,
                        img.height,
                        0,
                        0,
                    ) as Texture;

                    fish_ani.setSlotSkin('huobi', texture);
                });
            }
        }

        if (scale) {
            fish_ani.scale(scale, scale);
        }

        return fish_ani;
    }
    /** 创建鱼的阴影 */
    private initShadow() {
        const { pool } = this;
        const { type } = this.info;
        const { upside_down } = viewState.game;
        const shadow = createImgPool(`image/game/shadow`);
        shadow.pivot(shadow.texture.width / 2, shadow.texture.height / 2);
        pool.addChild(shadow);

        const shadow_info = getShadowInfo(type);
        this.shadow_node = shadow;

        if (upside_down) {
            this.shadow_info = {
                ...shadow_info,
                y: -shadow_info.y,
            };
        } else {
            this.shadow_info = shadow_info;
        }
        if (shadow_info.scaleX || shadow_info.scaleY) {
            shadow.scale(shadow_info.scaleX || 1, shadow_info.scaleY || 1);
        }
    }
    /** 创建 ani and shadow */
    public playSwimAni() {
        const { fish_ani, turn_ani_name } = this;
        if (fish_ani) {
            const name = turn_ani_name || 0;
            playSkeleton(fish_ani, name, true);
        }
    }
    /** 创建 ani and shadow */
    public stopSwimAni() {
        const { fish_ani } = this;
        if (fish_ani) {
            stopSkeleton(fish_ani);
        }
    }
    /** 设置显示状态 */
    public setVisible(visible: boolean) {
        this.visible = visible;
        if (visible) {
            this.initAni();
            this.playSwimAni();
        } else {
            this.stopSwimAni();
        }
    }
    /** 同步位置 */
    public syncPos(pos: Point, velocity: SAT.Vector, horizon_turn: boolean) {
        const { turn_ani, fish_ani, visible, shadow_node, shadow_info } = this;

        if (!visible) {
            return;
        }
        const angle = vectorToDegree(velocity) + 90;
        if (horizon_turn) {
            /** angle(-90 - 90) + 90 = 0-180 */
            const need_scale_x = angle > 0 && angle < 180;
            if (turn_ani) {
                const ani_name = need_scale_x ? 'right' : 'left';
                if (this.turn_ani_name !== ani_name) {
                    this.turn_ani_name = ani_name;
                    playSkeleton(fish_ani, ani_name, true);
                }
            } else {
                const scale_x = need_scale_x ? -1 : 1;
                if (scale_x !== this.scaleX) {
                    this.scaleX = need_scale_x ? -1 : 1;
                }
            }
        } else {
            this.rotation = angle;
            shadow_node.rotation = angle + 90;
        }

        this.pos(pos.x, pos.y);
        shadow_node.pos(pos.x + shadow_info.x, pos.y + shadow_info.y);
    }
    public beCastAni() {
        return new Promise((resolve, reject) => {
            const { fish_ani } = this;
            if (!fish_ani) {
                return;
            }
            fish_ani.filters = [createRedFilter()];
            clearTimeout(this.time_out);
            this.time_out = setTimeout(() => {
                if (fish_ani.destroyed) {
                    return;
                }
                fish_ani.filters = [];
                resolve(undefined);
            }, 500) as any;
        });
    }
    public destroy() {
        const { type } = this.info;

        if (this?.fish_ani?.filters) {
            this.fish_ani.filters = [];
        }
        if (this.shadow_node) {
            this.shadow_node.rotation = 0;
        }
        recoverSkeletonPool('other', 'coin_light', this.coin_light);
        recoverSkeletonPool('fish', type, this.fish_ani);
        recoverImgPool(`image/game/shadow`, this.shadow_node);

        this.fish_ani = undefined;
        this.shadow_node = undefined;

        clearTimeout(this.time_out);
        super.destroy();
    }
}
