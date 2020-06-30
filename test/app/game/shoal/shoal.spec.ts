import { ServerEvent } from 'data/serverEvent';
import { Test } from 'testBuilder';
import { genRandomStr } from 'utils/utils';
import { mock_web_socket_test } from '../../socket/mockSocket/mockWebsocket.spec';
import Shoal1Data from './shoal1.json';
import Shoal2Data from './shoal2.json';
import Shoal3Data from './shoal3.json';

export const shoal_test = new Test('shoal', runner => {
    runner.describe('add_shoal1', () => {
        console.log(Shoal1Data);
        addShoal(Shoal1Data);
    });
    runner.describe('add_shoal2', () => {
        addShoal(Shoal2Data);
    });
    runner.describe('add_shoal3', () => {
        addShoal(Shoal3Data);
    });
});

function addShoal(data: typeof Shoal1Data) {
    const total_time = 30000;
    const { fish } = data;
    const result = [] as ServerFishInfo[];
    for (const fish_item of fish) {
        const {
            startTimeRadio,
            endTimeRadio,
            fishId,
            displaceType,
            ...other
        } = fish_item;
        const totalTime = (endTimeRadio - startTimeRadio) * total_time;
        const usedTime = -startTimeRadio * total_time;

        result.push({
            eid: genRandomStr(),
            totalTime,
            usedTime,
            displaceType: displaceType as displaceType,
            fishId: fishId + '',
            ...other,
        });
    }

    mock_web_socket_test.runTest(ServerEvent.FishShoal, [result]);
}
