import { Test } from 'testBuilder';

import ItemRecord from '@app/view/pop/record/itemRecord';

export const record_test = new Test('record', (runner) => {
    runner.describe('open_item_record', async () => {
        const item_record = await ItemRecord.preEnter();
        item_record.setList(testData);
    });
});

const testData: GetItemListItemRep[] = [];
for (let i = 0; i < 1000; i++) {
    testData.push({
        name: `${i}`,
        buyNum: 100,
        giveTotal: 100,
        curNum: 100,
        currency: 'Btc',
    } as any);
}
