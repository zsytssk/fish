import * as path from 'path';
import ts from 'typescript';

import { exists } from '../zutil/ls/asyncUtil';
import { readCsv } from './csvUtils';
import { FileNode } from './fileNode';

export async function importIntl(file_path: string) {
    if (!exists(file_path)) {
        return console.error(`path dont exist ${file_path}`);
    }

    const raw_data = await readCsv(file_path);

    const intl_path = path.normalize(
        path.resolve(__dirname, '../../src/data/internationalConfig.ts'),
    );
    const file_node = new FileNode(intl_path);
    await file_node.replaceData(raw_data);
}
