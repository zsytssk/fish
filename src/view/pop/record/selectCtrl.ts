import { Sprite } from 'laya/display/Sprite';
import { List } from 'laya/ui/List';
import { Handler } from 'laya/utils/Handler';
import { onStageClick } from 'utils/layaUtils';

type SelectList = Sprite & {
    list: List;
};
type SelectedRender = (box: Sprite, data: any) => void;
export class SelectCtrl {
    private select_box: Sprite;
    private select_list: SelectList;
    private selected_render: SelectedRender;
    private list_render: SelectedRender;
    public select_index: number = -1;
    constructor(select_box: Sprite, select_list: SelectList) {
        this.select_box = select_box;
        this.select_list = select_list;
    }
    public init() {
        const { select_box, select_list } = this;

        select_box.on('click', null, () => {
            select_list.visible = !select_list.visible;
        });
        onStageClick(
            select_box,
            () => {
                select_list.visible = false;
            },
            [select_box, select_list],
        );
        select_list.list.selectHandler = Handler.create(
            null,
            (index: number) => {
                select_list.visible = false;
                if (index === -1) {
                    this.select_index = -1;
                    return;
                }
                if (!select_list.list.array.length) {
                    select_list.list.selectedIndex = -1;
                    return;
                }

                this.select_index = index;
                select_list.list.selectedIndex = -1;
                const data = select_list.list.array[index];
                this.selected_render?.(this.select_box, data);
            },
            null,
            false,
        );
        if (this.list_render) {
            select_list.list.renderHandler = Handler.create(
                null,
                this.list_render,
                null,
                false,
            );
        }
    }
    public setRender(
        selected_render: SelectedRender,
        list_render?: SelectedRender,
    ) {
        this.selected_render = selected_render;
        this.list_render = list_render;
    }
    public setListRender(render: SelectedRender) {
        this.selected_render = render;
    }
    public setList(list: any[]) {
        const { select_list } = this;
        select_list.list.array = list;

        if (this.select_index === -1) {
            select_list.list.selectedIndex = 0;
        }
    }
    public getIndex() {
        return this.select_list.list;
    }
    public destroy() {
        this.select_box = undefined;
        this.select_list = undefined;
        this.selected_render = undefined;
    }
}
