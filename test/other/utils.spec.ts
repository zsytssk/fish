import { changeNum, splitNum, addZeroToNum } from '../../src/utils/utils';
import { vectorToAngle, vectorToDegree } from 'utils/mathUtils';
import { Test } from 'testBuilder';

export const utils_test = new Test('utils', runner => {
    (window as any).vectorToDegree = vectorToDegree;

    // console.log(changeNum(9, 'add'));
    // console.log(splitNum(9));
    // console.log(addZeroToNum(9, 2));
});
