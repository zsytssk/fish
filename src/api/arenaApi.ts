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
    status: ArenaStatus;
};
