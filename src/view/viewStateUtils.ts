import { createSkeleton, createImg } from 'honor/utils/createSkeleton';
import { Skeleton } from 'laya/ani/bone/Skeleton';
import { Sprite } from 'laya/display/Sprite';
import { Image } from 'laya/ui/Image';

import { SpriteInfo } from '@app/data/sprite';
import { getSpriteInfo, createSprite } from '@app/utils/dataUtil';

const PoolMap = {} as {
    [key: string]: (Skeleton | Sprite)[];
};

type SkeletonPoolType = 'fish' | 'bullet' | 'net' | 'other';
export function createSkeletonPool(
    type: SkeletonPoolType,
    id: string,
    rate?: number,
    build_type?: number,
) {
    const map_key = `${type}:${id}`;
    const ani = PoolMap[map_key]?.pop();
    if (ani) {
        return ani;
    }
    if (type === 'fish') {
        return createSkeleton('ani/fish/fish' + id, rate, build_type);
    } else if (type === 'bullet') {
        const path = (getSpriteInfo(type, id) as SpriteInfo)?.path;
        return createSkeleton(path);
    } else if (type === 'net') {
        return createSprite(type, id);
    } else if (type === 'other') {
        return createSprite(type, id);
    }
}
export function recoverSkeletonPool(
    type: SkeletonPoolType,
    id: string,
    ani: Skeleton,
) {
    if (!ani || ani.destroyed) {
        return;
    }
    const map_key = `${type}:${id}`;
    let arr = PoolMap[map_key];
    if (!arr) {
        arr = PoolMap[map_key] = [];
    }
    ani.offAll();
    ani.stop();
    ani.removeSelf();
    arr.push(ani);
}

export function createImgPool(url: string) {
    const img = PoolMap[url]?.pop();
    if (img) {
        return img;
    }
    return createImg(url);
}
export function recoverImgPool(url: string, img: Sprite) {
    if (!img || img?.destroyed) {
        return;
    }
    const map_key = url;
    let arr = PoolMap[map_key];
    if (!arr) {
        arr = PoolMap[map_key] = [];
    }
    img.removeSelf();
    arr.push(img);
}
