/** 游戏状态 */
export enum ArenaStatus {
    /** 维护中  */
    ROOM_STATUS_MAINTAIN = 1,
    /** 未开启  */
    ROOM_STATUS_DISABLE = 2,
    /** 预热开启  */
    ROOM_STATUS_ENABLE_PREHEAT = 3,
    /** 开启中  */
    ROOM_STATUS_ENABLE = 4,
    /** 已结算  */
    ROOM_STATUS_SETTLEMENT = 5,
}
/** 游戏状态 */
export enum ArenaGameStatus {
    /** 时间段还未开放 */
    GAME_STATUS_CLOSE = 1,
    /** 首次免费玩 */
    GAME_STATUS_FREE = 2,
    /** 未报名 */
    GAME_STATUS_NO_SIGNUP = 3,
    /** 已报名 */
    GAME_STATUS_SIGNUP_OVER = 4,
    /** 游戏中 */
    GAME_STATUS_PLAYING = 5,
    /** 用户暂时离开 */
    GAME_STATUS_TABLE_OUT = 6,
    /** 已完成结算 */
    GAME_STATUS_SETTLEMENT = 7,
}

export type ServerItemInfo = {
    itemId: string;
    number: number;
    duration: number;
    coolTime: number;
    usedTime: number;
};

export type UseFreezeRep = {
    userId: string;
    number: number;
    duration: number;
    frozenFishList: string[];
};

export type LockFishRep = {
    userId: string;
    duration: number;
    needActive: boolean;
    eid: string;
    number: number;
};

export type ArenaStatusData = {
    endDate: number;
    startDate: number;
    userId: string;
    roomStatus: ArenaStatus;
    userStatus: ArenaGameStatus;
};

export type CompetitionInfo = {
    match: {
        startTime: number;
        endTime: number;
        startPeriod: string;
        endPeriod: string;
        fee: number;
    };
    currency: string;
    arenaStatus: ArenaStatus;
    champion: {
        amount: string;
        endRanking: number;
        currency: string;
        startRanking: number;
    }[];
    myself: { score: number; ranking: number; status: ArenaGameStatus };
};

export type SignUpReq = { currency: string };
export type SignUpRes = {
    mode: number;
    currency: string;
    status: ArenaGameStatus;
} & { code?: number };

/** 用户的数据 */
export type ServerUserInfo = {
    seatId: number;
    userId: string;
    bulletNum: number;
    multiple: number;
    turretSkin: string;
    lockFish: string;
    score: number;
    lockLeft: number;
    needEmit: boolean;
};

/** 复盘 */
export type EnterGameRep = {
    isGuest: 0 | 1;
    roomId: number;
    isFirstStart: boolean;
    rate: number;
    tableId: string;
    currency: string;
    table: {
        tableId: string;
        frozen: boolean;
        frozenLeft: number;
    };
    task: TaskTriggerRes;
    users: ServerUserInfo[];
    fish: ServerFishInfo[];
    items: ServerItemInfo[];
};

export type TableInRep = {
    seatId: number;
    userId: string;
    multiple: number;
    bulletNum: number;
    needEmit?: boolean;
    turretSkin: string;
};

export type GetDayRankingItem = {
    userId: number;
    score: number;
    award: number;
    currency: string;
};
export type GetDayRanking = {
    today: GetDayRankingItem[];
    yesterday: GetDayRankingItem[];
};

export type GiftItem = {
    itemId: number;
    num: number;
};
export type GiftList = {
    id: number;
    modeId: number;
    typeId: number;
    giftId: number;
    giftName: number;
    isGiftBuy: boolean;
    currency: 'BTC';
    price: number;
    list: GiftItem[];
};

export type BuyGiftReq = {
    id: number;
};
export type BuyGiftRep = { itemId: string; num: number }[];

export type SettleData = {
    userId: number | string;
    ranking: number;
    maxDayScore: number;
    score: number;
    currency: string;
    rankingAward: number;

    fee: string;
    isGuest: boolean;
};

export type GetHallOfFameDataItem = {
    userId: number | string;
    startDate: number;
    endDate: number;
    score: number;
};
export type GetHallOfFameData = GetHallOfFameDataItem[];

export type GetRuleData = {
    roomConfig: {
        freeNum: number;
    };
    globalConfig: {
        initBulletNum: number;
        rankingScoreDown: number;
        skinBulletAddition: {
            '1001': number;
            '1002': number;
            '1003': number;
            '1004': number;
            '1005': number;
        };
    };
    matchTimeConfig: {
        deadlineTime: number;
    };
};

export type ShopListDataItem = {
    currency: string;
    itemId: string;
    id: string;
    itemName: string;
    itemType: number;
    price: number;
    num: number;
    status: number;
};

export type ShopListData = ShopListDataItem[];

export type BuyGoodsData = {
    id: number | string;
    num: number;
};

export type TaskTriggerRes = {
    id: number;
    taskName: string;
    award: number;
    taskTime: number;
    list: { fishId: number; killNumber: number; reachNumber: number }[];
};
export type TaskRefreshRes = {
    list: {
        fishId: number;
        reachNumber: number;
        killNumber: number;
    }[];
};
export type TaskFinishRes = {
    userId: string;
    taskId: number;
    isComplete: boolean;
    award: number;
};

export type ArenaAwardListReq = {
    modeId: number;
    type: 1 | 2; //奖励类型 1日排行 2总冠军
    dayId?: string; //日排行参数
    matchId?: number; //总冠军参数 期数
    pageNum: number; //当前页
    pageSize: number; //每页显示数量
};
export type ArenaAwardListResItem = {
    ranking: number;
    time: number;
    award: number;
    currency: string;
    userId: string;
};
export type ArenaAwardListRes = {
    list: ArenaAwardListResItem[];
    pageNum: number; //当前页
    pageSize: number; //每页显示数量
    pages: number; //总页
    total: number;
};

export type MatchListRes = {
    id: number;
}[];
