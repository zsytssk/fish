import { Laya } from 'Laya';
import Honor, { HonorDialog, HonorDialogConfig } from 'honor';
import { openDialog } from 'honor/utils/loadRes';
import { Sprite } from 'laya/display/Sprite';
import { Event } from 'laya/events/Event';
import { Rectangle } from 'laya/maths/Rectangle';
import { HitArea } from 'laya/utils/HitArea';

import { offLangChange, onLangChange } from '@app/ctrl/hall/hallCtrlUtil';
import { ui } from '@app/ui/layaMaxUI';
import { fade_in, fade_out } from '@app/utils/animate';
import { getRectRadiusPath } from '@app/utils/layaUtils';
import { callFunc, tplIntr } from '@app/utils/utils';

import { NextType } from './core/guideUtils';
import { guide_state, Shape } from './guideState';

/**
 * @author zhangshiyang
 * @description 新手引导弹出层
 */

export default class GuideDialog
    extends ui.pop.guide.GuideDialogUI
    implements HonorDialog
{
    public config: HonorDialogConfig = {};
    private mask_area: Sprite;
    private blank_area: Sprite;
    public blank_shape: Shape;
    public handler: {
        next: FuncVoid;
        skip: (type: string) => void;
    };
    public click_center: Point;
    /** 是否强制点击空白区域 */
    public force: boolean;
    public zOrder = 99;
    constructor() {
        super();
        this.isShowEffect = undefined;
        this.config = {
            shadowAlpha: 0,
        };
    }
    public onAwake() {
        this.init();
        onLangChange(this, () => {
            this.initLang();
        });
    }
    private initLang() {
        const { start_label, skip_label } = this;
        skip_label.text = tplIntr('tourSkip');
        start_label.text = tplIntr('tourStart');
    }
    public static async preEnter() {
        const dialog = (await openDialog(
            'pop/guide/GuideDialog.scene',
        )) as GuideDialog;
        return dialog;
    }
    public onResize() {
        const { width, height } = Laya.stage;
        const { mask_area, mask_wrap, inner } = this;
        if (!mask_area) {
            return;
        }

        const con_width = width > 1920 ? 1920 : width;
        mask_area.width = con_width;
        mask_area.height = height;

        mask_area.x = (this.width - mask_area.width) / 2;
        mask_area.y = (this.height - mask_wrap.height) / 2;

        mask_area.graphics.clear();
        mask_area.graphics.drawRect(0, 0, mask_area.width, height, '#000000');

        this.x = (width - this.width) / 2;
        this.y = (height - this.height) / 2;

        inner.width = width > 1920 ? 1920 : width;
    }
    public init() {
        this.initDom();
        this.initEvent();
    }
    public initDom() {
        const { mask_wrap } = this;
        this.cacheAs = 'bitmap';
        const mask_area = new Laya.Sprite();
        mask_wrap.addChild(mask_area);
        mask_area.alpha = 0.8;
        mask_area.mouseEnabled = true;
        this.mask_area = mask_area;

        const blank_area = new Laya.Sprite();
        mask_wrap.addChild(blank_area);
        blank_area.blendMode = 'destination-out';
        this.blank_area = blank_area;

        // 设置点击区域
        blank_area.mouseEnabled = true;
        const hit_area = new HitArea();
        blank_area.hitArea = hit_area;
        this.blank_area = blank_area;

        if (!mask_area) {
            return;
        }
        this.onResize();
    }
    public setBtnNextDir(dir: 'left' | 'right') {
        const { btn_next } = this;
        if (dir === 'left') {
            btn_next.right = NaN;
            btn_next.rotation = 180;
            btn_next.left = 30;
        } else {
            btn_next.left = NaN;
            btn_next.right = 30;
            btn_next.rotation = 0;
        }
    }
    public initEvent() {
        const { btn_skip, mask_area } = this;
        Laya.stage.on(Event.RESIZE, this, this.onResize.bind(this));
        mask_area.on(Event.CLICK, this, (e: Event) => {
            const { force } = this;
            const { pointer } = guide_state;
            const { x, y } = this.getMousePoint();
            if (!force) {
                pointer.hide();
                return this.forceNext();
            }
            if (!pointer.isShow()) {
                return;
            }

            pointer.show({ x, y });
            pointer.moveToTarget({ x, y }, this.click_center);
        });

        btn_skip.on(Event.CLICK, this, (e: Event) => {
            this.forceSkip();
        });
    }
    public forceNext() {
        const { handler } = this;
        if (!handler) {
            return;
        }
        callFunc(handler.next);
        this.handler = undefined;
    }
    public forceSkip() {
        const { handler } = this;
        if (!handler) {
            this.destroy();
            return;
        }
        callFunc(handler.skip, 'skip');
        this.handler = undefined;
    }
    public showNextHandler(type: NextType, then: Promise<any>) {
        const { btn_next, btn_start, blank_area } = this;
        const { pointer } = guide_state;

        then.then(() => {
            if (type === 'btn') {
                fade_in(btn_next);
                btn_next.once(Event.CLICK, btn_next, () => {
                    this.forceNext();
                    btn_next.offAll();
                    fade_out(btn_next);
                });
            } else if (type === 'point') {
                blank_area.once(Event.CLICK, this, (e: Event) => {
                    blank_area.offAll();
                    e.stopPropagation();
                    pointer.hide();
                    this.forceNext();
                });
                pointer.show(this.click_center, 'target');
            } else if (type === 'start') {
                fade_in(btn_start);
                btn_start.once(Event.CLICK, btn_start, () => {
                    this.forceNext();
                    btn_start.offAll();
                    fade_out(btn_start);
                });
            }
        });
    }
    /** 绘制空白区域, 在区域被点击的时候返回resolve
     * @param force 必须点击目标区域...
     */
    public drawBlankWaitClick(
        shape: Shape,
        force: boolean,
        type: NextType,
        then: Promise<any>,
    ) {
        return new Promise<void>((resolve, reject) => {
            const { blank_area } = this;
            const { hit } = blank_area.hitArea;
            this.blank_shape = shape;
            this.handler = {
                next: resolve,
                skip: reject,
            };
            this.force = force;
            this.click_center = calcCenterShape(shape);
            this.showBlank();
            blank_area.graphics.clear();
            this.showNextHandler(type, then);
            if (shape instanceof Rectangle) {
                const path = getRectRadiusPath(
                    shape.x,
                    shape.y,
                    shape.width,
                    shape.height,
                    10,
                );

                blank_area.graphics.drawPath(0, 0, path, {
                    fillStyle: '#00ffff',
                });
                hit.drawRect(shape.x, shape.y, shape.width, shape.height, {
                    fillStyle: '#FFFFFF',
                });
            } else {
                blank_area.graphics.drawCircle(
                    shape.x,
                    shape.y,
                    shape.radius,
                    '#000000',
                );
                hit.drawCircle(shape.x, shape.y, shape.radius, '#000000');
            }
        });
    }
    public showBlank() {
        const { mask_area } = this;
        mask_area.graphics.clear();
        mask_area.graphics.drawRect(
            0,
            0,
            mask_area.width,
            mask_area.height,
            '#000000',
        );
    }
    public clearBlank() {
        const { blank_area, mask_area } = this;
        this.blank_shape = undefined;
        const { hit } = blank_area.hitArea;
        blank_area.graphics.clear();
        mask_area.graphics.clear();
        hit.clear();

        this.handler = undefined;
        this.click_center = undefined;
    }
    public hide() {
        this.clearBlank();
        this.close();
    }
    public destroy() {
        offLangChange(this);
        super.destroy();
    }
}

function calcCenterShape(shape: Shape) {
    if (shape instanceof Rectangle) {
        return { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
    } else {
        return { x: shape.x, y: shape.y };
    }
}
