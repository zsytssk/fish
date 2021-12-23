/** 游戏状态 */
export enum ArenaStatus {
    /** 维护中  */
    Maintenance = 1,
    /** 未开启  */
    NoOpen = 2,
    /** 开启  */
    Open = 3,
    /** 结束  */
    Settle = 4,
}

/** 房间状态 */
export enum ArenaRoomStatus {
    /** 未开始  */
    NoOpen = 1,
    /** 开始  */
    Open = 2,
    /** 进行中  */
    OnGoing = 3,
}

export type ArenaStatusData = {
    endDate: number;
    startDate: number;
    userId: string;
    status: ArenaStatus;
};

/** 游戏状态 */
export enum ArenaGameStatus {
    /** 时间段还未开放 */
    GAME_STATUS_CLOSE = 1,
    /** 首次免费玩 */
    GAME_STATUS_FREE = 2,
    /** 比赛开始 */
    GAME_STATUS_SIGNUP = 3,
    /** 已报名 */
    GAME_STATUS_SIGNUP_OVER = 4,
    /** 游戏中 */
    GAME_STATUS_PLAYING = 5,
    /** 已完成结算 */
    GAME_STATUS_SETTLEMENT = 6,
}

export type CompetitionInfo = {
    match: {
        startTime: number;
        endTime: number;
        startPeriod: string;
        endPeriod: string;
        fee: number;
    };
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
};

/** 用户的数据 */
export type ServerUserInfo = {
    seatId: number;
    userId: string;
    bulletNum: number;
    multiple: number;
    turretSkin: string;
    lockFish: string;
    lockLeft: number;
    needEmit: boolean;
};

/** 复盘 */
export type EnterGameRep = {
    isTrial: 0 | 1;
    roomId: number;
    isFirstStart: boolean;
    rate: number;
    tableId: string;
    currency: string;
    frozen: boolean;
    frozenLeft: number;
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
};
export type GetDayRanking = {
    today: GetDayRankingItem[];
    yesterday: GetDayRankingItem[];
};

export type GiftItem = {
    goodsId: number;
    goodsNum: number;
};
export type GiftList = {
    id: number;
    modeId: number;
    typeId: number;
    giftId: number;
    giftName: number;
    currency: 'BTC';
    price: number;
    list: GiftItem[];
};

export type BuyGiftRep = {
    id: number;
};

export type SettleData = {
    userId: number | string;
    ranking: number;
    maxDayScore: number;
    score: number;
    rankingAward: number;
};

export type GetHallOfFameDataItem = {
    userId: number | string;
    startDate: string;
    endDate: string;
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

export type ShopListData = {
    currency: string;
    itemId: string;
    itemName: string;
    itemType: number;
    price: number;
    num: number;
    status: number;
}[];

export type BuyGoodsData = {
    goodsId: number | string;
    goodsNum: number;
};

export type TaskTriggerRes = {
    taskId: number;
    name: string;
    award: number;
    duration: number;
    list: { index: number; type: number; killNumber: number }[];
};
export type TaskRefreshRes = {
    index: number;
    type: number;
    reachNumber: number;
    killNumber: number;
}[];
export type TaskFinishRes = {
    userId: string;
    taskId: number;
    isComplete: boolean;
    award: number;
};
