export function createLineDisplaceFun(
    typeId: string,
    totalTime: number,
    usedTime: number,
    y: number,
) {
    return {
        displaceType: 'fun',
        fishId: typeId,
        eid: `fish${typeId}`,
        totalTime,
        usedTime,
        funList: [
            {
                funNo: '3',
                len: 1334,
                funParams: [
                    {
                        x: 1920,
                        y,
                    },
                    {
                        x: 0,
                        y,
                    },
                ],
            },
        ],
    } as ServerFishInfo;
}
