import { Test } from 'testBuilder';
import ItemRecord from 'view/pop/record/itemRecord';

export const record_test = new Test('record', runner => {
    runner.describe('open_item_record', async () => {
        ItemRecord.preEnter();
    });
});
