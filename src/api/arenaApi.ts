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
    rate: number;
    tableId: string;
    currency: string;
    frozen: boolean;
    frozenLeft: number;
    users: ServerUserInfo[];
    fish: ServerFishInfo[];
    items: ServerItemInfo[];
};
