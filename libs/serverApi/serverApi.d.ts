type DisplaceType = 'path' | 'fun';

/** 鱼群的信息 */
type ServerShoalInfo = {
    shoalId: string;
    totalTime: number;
    usedTime: number;
    fishList: ServerFishInfo[];
    revert?: boolean;
};

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
    group?: Array<{
        fishId: string;
    }>;
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

/** 复盘的信息 */
type ReplayInfo = {};

type ServerShoalInfo = {
    shoalId: string;
    totalTime: number;
    usedTime: number;
    reverse?: boolean;
    fish: ServerFishInfo[];
};

type ServerFishInfo = {
    fishId: string;
    typeId: string;
    centerFishTypeId?: string;
    isSpecial?: boolean;
    displaceType: 'fun' | 'path';
    pathNo?: string;
    usedTime?: number;
    totalTime?: number;
    funNo?: string;
    funPrams?: any[];
    startTimeRadio?: number;
    endTimeRadio?: number;
    reverse?: boolean;
};

/**服务器数据结构*/
type ServerGameInfo = {
    userId: string;
    roomId: string;
    tableId: string;
    fish: ServerFishInfo[];
    shoal: ServerShoalInfo;
    items: ServerItemData[];
    userItems: ServerItemInfo;
    users: ServerPlayerInfo[];
};

type ServerItemData = {
    status?: 1 | 0; // 成功使用
    itemId: string;
    userId?: string;
    usedTime?: number;
    fish?: ServerFishInfo[];
};

type ServerItemInfo = {
    [key: string]: {
        count?: 50;
        coolTime?: 10;
    };
};
