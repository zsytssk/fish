import { International } from '../../src/data/internationalConfig';
import { writeCsv } from './csvUtils';

export async function exportIntl() {
    const result = {} as { [key: string]: { lang: string; str: string }[] };
    for (const [key, item] of Object.entries(International)) {
        for (const [inner_key, inner_item] of Object.entries(item)) {
            if (!result[inner_key]) {
                result[inner_key] = [];
            }
            if (inner_item !== '') {
                result[inner_key].push({ str: inner_item, lang: key });
            }
        }
    }

    for (const [key, item] of Object.entries(result)) {
        if (item.length == 5) {
            delete result[key];
        }

        if (item.length <= 2) {
            console.log(`test:>`, key);
        }
    }

    await writeCsv(result);
}
