import { ServerEvent } from '@app/data/serverEvent';
import { genRandomStr } from '@app/utils/utils';

import { mock_web_socket_test } from '../../socket/mockSocket/mockWebsocket.spec';
import Shoal1Data from './shoal1.json';
import Shoal2Data from './shoal2.json';

export const shoal_test = {
    addShoal1: () => {
        console.log(Shoal1Data);
        addShoal(Shoal1Data);
    },
    add_shoal2: () => {
        addShoal(Shoal2Data as any);
    },
};

function addShoal(data: typeof Shoal1Data) {
    const total_time = 100000;
    const { fish } = data;
    const result = [] as ServerFishInfo[];
    for (const fish_item of fish) {
        const { startTimeRadio, endTimeRadio, fishId, displaceType, ...other } =
            fish_item;
        const totalTime = (endTimeRadio - startTimeRadio) * total_time;
        const usedTime = -startTimeRadio * total_time;

        result.push({
            eid: genRandomStr(),
            totalTime,
            usedTime,
            displaceType: displaceType as displaceType,
            fishId: fishId + '',
            ...other,
        } as any);
    }

    mock_web_socket_test[ServerEvent.FishShoal](result);
}
