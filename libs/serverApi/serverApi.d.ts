type DisplaceType = 'path' | 'fun';

type ServerFishInfo = {
    fishId: string;
    typeId: string;
    displaceType: DisplaceType;
    pathNo?: string;
    startTime?: number;
    totalTime?: number;
    usedTime?: number;
    reverse?: boolean;
    funNo?: string;
    funList?: any[];
};
type CaptureFishInfo = {
    fishId: string;
    award: number;
};

type ServerPlayerInfo = {
    userId: string;
    serverIndex: number;
    level: number;
    gold: number;
    gunSkin: string;
    nickname: string;
    avatar: string;
};
