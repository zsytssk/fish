import { exists } from '../zutil/ls/asyncUtil';
import { readCsv } from './csvUtils';

export async function importIntl(file_path: string) {
    if (!exists(file_path)) {
        return console.error(`path dont exist ${file_path}`);
    }

    const raw_data = await readCsv(file_path);
    console.log(`test:>`, raw_data);
}
