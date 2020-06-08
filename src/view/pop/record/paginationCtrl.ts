import { Button } from 'laya/ui/Button';
import { Sprite } from 'laya/display/Sprite';
import { Image } from 'laya/ui/Image';
import { Label } from 'laya/ui/Label';
import { Box } from 'laya/ui/Box';
import { Pagination, PaginationItem } from 'utils/pagination';
import { resizeContain } from 'utils/layaUtils';
import { EventCom } from 'comMan/eventCom';

export const PaginationEvent = {
    Change: 'change',
};
type RenderData = ReturnType<InstanceType<typeof Pagination>['output']>;
/** 分页控制 */
export class PaginationCtrl extends EventCom {
    private view: Box;
    private pagination: Pagination;
    constructor(view: Box) {
        super();
        this.view = view;
        this.init();
    }
    private init() {
        const { view } = this;
        view.removeChildren();
        this.pagination = new Pagination();
    }
    public update(total: number, page_size: number) {
        this.pagination.updateData(total, page_size);
        this.render(this.pagination.output());
    }
    private triggerAction(action: PaginationItem) {
        const { pagination } = this;
        switch (action) {
            case 'prev':
                pagination.prev();
                break;
            case 'next':
                pagination.next();
                break;
            case 'left_spread':
                pagination.leftSpread();
                break;
            case 'right_spread':
                pagination.rightSpread();
                break;
            default:
                pagination.setCurPage(action);
                break;
        }
        this.render(pagination.output());
    }
    private render(data: RenderData) {
        const { view } = this;
        const { pagination_arr, cur_page, item_range } = data;

        view.removeChildren();
        console.log(pagination_arr);
        for (const item of pagination_arr) {
            let btn: Button;
            switch (item) {
                case 'prev':
                    btn = createPrev();
                    break;
                case 'next':
                    btn = createNext();
                    break;
                case 'left_spread':
                    btn = createSpread();
                    break;
                case 'right_spread':
                    btn = createSpread();
                    break;
                default:
                    btn = createIndex(item + 1, item === cur_page);
                    break;
            }
            btn.on('click', null, () => {
                this.triggerAction(item);
            });
            view.addChild(btn);
        }

        resizeContain(view, 10);
        view.x = ((view.parent as Sprite).width - view.width) / 2;
        this.emit(PaginationEvent.Change, { cur: cur_page, range: item_range });
    }
}

// type Btn = Button & {
//     label?: Label;
//     type: PaginationItem;
// };
// const temp = {} as { [key: string]: Btn };
function createPrev() {
    const button = new Button();
    button.skin = 'image/pop/record/btn_pagination1.png';
    button.stateNum = 1;
    button.label = '';

    const sprite = new Image();
    sprite.skin = 'image/pop/record/left.png';
    sprite.x = 23;
    sprite.y = 8;
    button.addChild(sprite);
    return button;
}
function createNext() {
    const button = new Button();
    button.skin = 'image/pop/record/btn_pagination1.png';
    button.stateNum = 1;
    button.label = '';

    const sprite = new Image();
    sprite.skin = 'image/pop/record/next.png';
    sprite.x = 23;
    sprite.y = 8;
    button.addChild(sprite);

    return button;
}
function createIndex(index: number, is_cur?: boolean) {
    const button = new Button();
    button.skin = 'image/pop/record/btn_pagination2.png';
    button.stateNum = 1;
    button.label = '';

    const label = new Label();
    label.fontSize = 25;
    label.bold = true;
    if (is_cur) {
        label.color = '#492b00';
        button.skin = 'image/pop/record/btn_pagination0.png';
    } else {
        label.color = '#06684a';
        button.skin = 'image/pop/record/btn_pagination2.png';
    }
    label.align = 'center';
    label.valign = 'middle';
    label.x = 8;
    label.y = 7;
    label.width = 54;
    label.height = 29;
    label.text = index + '';
    button.addChild(label);
    return button;
}

function createSpread() {
    const button = new Button();
    button.skin = 'image/pop/record/btn_pagination2.png';
    button.stateNum = 1;
    button.label = '';

    const label = new Label();
    label.fontSize = 25;
    label.bold = true;
    label.color = '#06684a';
    label.align = 'center';
    label.valign = 'middle';
    label.x = 8;
    label.y = 5;
    label.width = 54;
    label.height = 29;
    label.text = '...';
    button.addChild(label);
    return button;
}
