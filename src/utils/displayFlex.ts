import { Sprite } from 'laya/display/Sprite';
import { Box } from 'laya/ui/Box';

type Dir = 'horizontal' | 'vertical';
type DisplayFlexProps = {
    node: Sprite;
    align?: 'left' | 'center' | 'right';
    valign?: 'top' | 'middle' | 'bottom';
    padding?: number;
    dir?: Dir;
    space?: number;
    min?: number;
    reverse?: boolean;
};

export function displayFlex({
    node,
    dir = 'horizontal',
    align = 'center',
    valign = 'middle',
    padding = 0,
    space = 0,
    min = 0,
    reverse = false,
}: DisplayFlexProps) {
    const { numChildren } = node;

    const items: Sprite[] = [];
    for (let i = 0; i < numChildren; i++) {
        const item = node.getChildAt(i) as Sprite;
        if (!item.visible) {
            continue;
        }
        console.log(`test:>`, item.width);

        if (reverse) {
            items.unshift(item);
        } else {
            items.push(item);
        }
    }

    const max_height = items.sort((a, b) => b.height - a.height)[0].height;
    const max_width = items.sort((a, b) => b.width - a.width)[0].width;

    console.log(`test:>max_width`, max_width);
    if (dir === 'horizontal') {
        node.height = max_height + padding * 2;
    } else {
        node.width = max_width + padding * 2;
    }

    let dist = padding;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (dir === 'horizontal') {
            // calcChildPos({ parent: node, child: item, valign });
            item.x = dist;
        } else {
            // calcChildPos({ parent: node, child: item, align });
            item.y = dist;
        }

        console.log(`test:>`, item, {
            x: item.x,
            y: item.y,
            height: item.height,
            width: item.width,
        });

        if (dir === 'horizontal') {
            dist += item.width;
            if (i !== items.length - 1) {
                dist += space;
            }
        } else {
            dist += item.height;
            if (i !== items.length - 1) {
                dist += space;
            }
        }
    }

    if (dir === 'horizontal') {
        const width = dist + padding;
        if (width > min) {
            node.width = width;
        }
    } else {
        const height = dist + padding;
        if (height > min) {
            node.height = height;
        }
    }
}

type ChildPos = {
    parent: Sprite;
    child: Sprite;
    align?: DisplayFlexProps['align'];
    valign?: DisplayFlexProps['valign'];
};

export function calcChildPos({ parent, child, align, valign }: ChildPos) {
    if (align === 'left') {
        child.x = 0;
    } else if (align === 'center') {
        child.x = (parent.width - child.width) / 2;
    } else if (align === 'right') {
        child.x = parent.width - child.width;
    }

    if (valign === 'top') {
        child.y = 0;
    } else if (valign === 'middle') {
        child.y = (parent.height - child.height) / 2;
    } else if (valign === 'bottom') {
        child.y = parent.height - child.height;
    }
}
