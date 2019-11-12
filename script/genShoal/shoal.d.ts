export type displaceType = 'path' | 'fun';
export type ShoalFishInfo = {
    fishId: string;
    startTimeRadio: number;
    endTimeRadio: number;
    displaceType: displaceType;
    displaceLen?: number;
    dieReBorn?: boolean;
    funList?: {
        funNo?: string;
        radio: number;
        params?: any[];
    }[];
};
