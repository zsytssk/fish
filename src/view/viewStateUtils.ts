import { Skeleton } from 'laya/ani/bone/Skeleton';
import { SpriteInfo } from 'data/sprite';
import { getSpriteInfo, createSprite } from 'utils/dataUtil';
import { createSkeleton } from 'honor/utils/createSkeleton';

const SkeletonPoolMap = {} as {
    [key: string]: Skeleton[];
};

type SkeletonPoolType = 'fish' | 'bullet' | 'net';
export function createSkeletonPool(type: SkeletonPoolType, id: string) {
    const map_key = `${type}:${id}`;
    const ani = SkeletonPoolMap[map_key]?.pop();
    if (ani) {
        return ani;
    }
    if (type === 'fish') {
        return createSkeleton('ani/fish/fish' + type);
    } else if (type === 'bullet') {
        const path = (getSpriteInfo(type, id) as SpriteInfo)?.path;
        return createSkeleton(path);
    } else if (type === 'net') {
        return createSprite(type, id);
    }
}
export function recoverSkeletonPool(
    type: SkeletonPoolType,
    id: string,
    ani: Skeleton,
) {
    const map_key = `${type}:${id}`;
    let arr = SkeletonPoolMap[map_key];
    if (!arr) {
        arr = SkeletonPoolMap[map_key] = [];
    }
    arr.push(ani);
}
