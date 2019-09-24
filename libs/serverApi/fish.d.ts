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
