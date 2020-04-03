import Honor, { HonorDialog, HonorDialogConfig } from 'honor';
import { ui } from 'ui/layaMaxUI';
import { guide_state, Shape } from './guideState';
import { Sprite } from 'laya/display/Sprite';
import { Laya } from 'Laya';
import { HitArea } from 'laya/utils/HitArea';
import { Event } from 'laya/events/Event';
import { Rectangle } from 'laya/maths/Rectangle';
import { callFunc } from 'utils/utils';

/**
 * @author zhangshiyang
 * @description 新手引导弹出层
 */

export default class GuideDialog extends ui.pop.guide.GuideDialogUI
    implements HonorDialog {
    public config: HonorDialogConfig = {};
    private mask_area: Sprite;
    private blank_area: Sprite;
    public blank_shape: Shape;
    public click_handler: FuncVoid;
    public click_center: Point;
    /** 是否强制点击空白区域 */
    public force: boolean;
    public zOrder = 100;
    constructor() {
        super();
        this.isShowEffect = undefined;
        this.config = {
            shadowAlpha: 0,
        };
    }
    public onAwake() {
        this.init();
    }
    public static async preEnter() {
        const dialog = (await Honor.director.openDialog(
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
        mask_area.graphics.clear();
        mask_area.graphics.drawRect(0, 0, width, height, '#000000');

        mask_area.width = width;
        mask_area.height = height;

        mask_area.x = (mask_wrap.width - width) / 2;
        mask_area.y = (mask_wrap.height - height) / 2;

        this.x = (width - this.width) / 2;
        this.y = (height - this.height) / 2;

        inner.width = width > 1334 ? 1334 : width;
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
        mask_area.alpha = 0.5;
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

        const { width, height } = Laya.stage;
        if (!mask_area) {
            return;
        }

        mask_area.width = width;
        mask_area.height = height;

        mask_area.x = (mask_wrap.width - width) / 2;
        mask_area.y = (mask_wrap.height - height) / 2;

        this.x = (width - this.width) / 2;
        this.y = (height - this.height) / 2;
    }
    public initEvent() {
        const { blank_area, mask_area } = this;
        Laya.stage.on(Event.RESIZE, this, this.onResize.bind(this));
        mask_area.on(Event.CLICK, this, (e: Event) => {
            const { force } = this;
            const { pointer } = guide_state;
            const { x, y } = this.getMousePoint();
            const { click_handler } = this;
            if (!click_handler) {
                return;
            }
            if (!force) {
                pointer.hide();
                return callFunc(click_handler);
            }

            pointer.show({ x, y });
            pointer.moveToTarget({ x, y }, this.click_center);
        });

        blank_area.on(Event.CLICK, this, (e: Event) => {
            const { pointer } = guide_state;

            e.stopPropagation();
            pointer.hide();
            const { click_handler } = this;
            callFunc(click_handler);
        });
    }
    public forceNext() {
        const { click_handler } = this;
        callFunc(click_handler);
    }
    /** 绘制空白区域, 在区域被点击的时候返回resolve
     * @param force 必须点击目标区域...
     */
    public drawBlankWaitClick(shape: Shape, force: boolean) {
        return new Promise((resolve, reject) => {
            const { pointer } = guide_state;
            const { blank_area } = this;
            const { hit } = blank_area.hitArea;
            this.blank_shape = shape;
            this.click_handler = resolve;
            this.force = force;
            this.click_center = calcCenterShape(shape);
            this.showBlank();
            blank_area.graphics.clear();
            // pointer.show(this.click_center, 'target');
            if (shape instanceof Rectangle) {
                blank_area.graphics.drawRect(
                    shape.x,
                    shape.y,
                    shape.width,
                    shape.height,
                    '#000000',
                );
                hit.drawRect(
                    shape.x,
                    shape.y,
                    shape.width,
                    shape.height,
                    '#000000',
                );
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

        this.click_handler = undefined;
        this.click_center = undefined;
    }
    public hide() {
        this.clearBlank();
        this.close();
    }
}

function calcCenterShape(shape: Shape) {
    if (shape instanceof Rectangle) {
        return { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 };
    } else {
        return { x: shape.x, y: shape.y };
    }
}
