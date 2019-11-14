// http://gitlab.intranet.huiyin.com/springfans/game/game-bitfish-server/blob/docker/API.md
// import {} from 'data/serverEvent';

type RoomInReq = {
    roomId: number;
    /** 是否试玩 */
    isTrial: 0 | 1;
    /** 币种 */
    currency: number;
};

type RoomInRep = {
    roomId: number;
    bulletNum: number;
    socketUrl: string;
};
type CheckReplayRep = {
    isReplay: boolean;
    socketUrl: string;
};
type TableOutRep = {
    userId: string;
};
/** 用户的数据 */
type ServerUserInfo = {
    index: number;
    userId: string;
    bulletNum: number;
    multiple: number;
    turretSkin: string;
    lockFish: string;
    lockLeft: number;
};

type displaceType = 'path' | 'fun';
type ServerFishInfo = {
    eid: string;
    fishId: string;
    group?: {
        eid: string;
        index: number;
    }[];
    displaceType: displaceType;
    pathNo?: string;
    pathList?: number[][];
    usedTime: number;
    totalTime: number;
    displaceLen?: number;
    dieReBorn?: boolean;
    funList?: {
        funNo?: string;
        radio: number;
        params?: any[];
    }[];
    reverse?: boolean;
    frozen?: boolean;
    startTime?: number;
    inScreen?: boolean;
};
type ServerItemInfo = {
    itemId: string;
    count: number;
    coolTime: number;
    usedTime: number;
};
type ServerAddFishRep = {
    fish: ServerFishInfo[];
};

/** 复盘 */
type EnterGameRep = {
    roomId: number;
    tableId: string;
    frozen: boolean;
    frozenLeft: number;
    users: ServerUserInfo[];
    fish: ServerFishInfo[];
    items: ServerItemInfo[];
};

type RoomOutRep = {
    userId: string;
};
type ShootReq = {
    direction: Point;
};
type ShootRep = {
    userId: string;
    direction: Point;
};
type HitReq = {
    eid: string;
    multiple: number;
};
type HitDrop = {
    itemId: string;
    itemNum: number;
};
type HitRep = {
    userId?: string;
    eid: string;
    bet?: string;
    win: number;
    balance?: number;
    drop: HitDrop[];
};
/** 换炮台等级 */
type ChangeTurretReq = {
    multiple: number;
};
type ChangeTurretRep = {
    userId: string;
    multiple: number;
};
type FishShoalWarnRep = {
    shoalId: string;
    delay: number;
};
type FishShoal = {
    shoalId: string;
    fish: ServerFishInfo[];
};
type UseFreezeRep = {
    userId: string;
    count: number;
    duration: number;
    frozenFishList: string[];
};

type FreezeOverRep = {
    tableId: string;
};
type UseLockRep = {
    userId: string;
    count: number;
    lockedFish: string;
    duration: number;
};
/** 锁定鱼 */
type LockFishRep = {
    eid: string;
};
type LockFishReq = {
    userId: string;
    eid: string;
};
type FishBombReq = {
    bombPoint: Point;
    eid: string;
    fishList: string[];
};
type FishBombRep = {
    userId: string;
    bombPoint: Point;
    killedFish: UseBombFishInfo[];
};
type UseBombReq = {
    bombPoint: Point;
    fishList: string[];
};

type UseBombFishInfo = {
    eid: string;
    win: number;
    drop?: HitDrop;
};
type UseBombRep = {
    userId: string;
    bombPoint: Point;
    count: number;
    killedFish: UseBombFishInfo[];
    balance?: number;
};

type PowerUpRep = {
    userId: string;
    duration: number;
};
type SetRobotReportRep = {};
type UserAccountRep = {
    userId: string;
    email: string;
    showName: string;
    balances: Array<{
        currency: string;
        available: number;
    }>;
};
type GetDomainRep = {
    domain: string;
    cdn: string;
    api: string;
    sso: string;
    domainRecharge: string;
    channelRecharge: string;
    homeUrl: string;
    roomApi: string;
    serverApi: string;
    newServerApi: string;
};

type ItemPrice = {
    type: number;
    count: number;
    name: string;
};
type LotteryRep = {
    list: ItemPrice[];
};
type TicketExchangeRep = {
    list: ItemPrice[];
};
type ShopItem = {
    id: string;
    name: string;
    price: number;
    status: number;
};
type ShopListRep = {
    turret: ShopItem[];
    bullet: ShopItem[];
    items: ShopItem[];
};
type BuyReq = {
    id: string;
};
type BuyRep = {
    count: number;
    name: string;
};
