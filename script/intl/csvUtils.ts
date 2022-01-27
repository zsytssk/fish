import * as csvFormat from '@fast-csv/format';
import * as csvParse from '@fast-csv/parse';

import * as fs from 'fs';
import * as path from 'path';

import * as config from './config.json';
import { formatDateTime } from './utils';

export type RawData = { [key: string]: { str: string; lang: string }[] };

export type DataItem = {
    [key: typeof config.headers[number]]: string;
};
export type Data = DataItem[];

export function writeCsv(data: RawData) {
    return new Promise<void>((res, rej) => {
        const rows = rawDataToData(data);
        const file_name = formatDateTime(Date.now(), 'YYYYMMDD') + '.csv';
        const file_path = path.resolve(config.export_path, file_name);
        const write_stream = fs.createWriteStream(file_path, {
            encoding: 'utf8',
        });
        const options = {
            headers: config.headers,
            writeHeaders: true,
            includeEndRowDelimiter: true,
            writeBOM: true,
        };

        console.log(`test:>`, file_path);
        csvFormat
            .writeToStream(write_stream, rows, options)
            .on('error', (err) => rej(err))
            .on('finish', () => res());
    });
}
export async function readCsv(file_path: string) {
    const data = await new Promise<string[][]>((resolve, reject) => {
        const data = [];

        csvParse
            .parseFile(file_path, {})
            .on('error', reject)
            .on('data', (row) => {
                if (row) data.push(row);
            })
            .on('end', () => {
                resolve(data);
            });
    });

    const [headers, ...reset] = data;
    return dataToRawData(headers, reset);
}

export function rawDataToData(data: RawData): Data {
    const result: Data = [];
    for (const [key, item] of Object.entries(data)) {
        const result_item: DataItem = { translationId: key };

        for (const inner_item of item) {
            result_item[inner_item.lang] = encryptBl(inner_item.str);
        }
        result.push(result_item);
    }

    return result;
}
export function dataToRawData(headers: string[], data: string[][]): RawData {
    const result = {} as RawData;
    for (const item of data) {
        let key: string;
        const inner_item = [];
        for (const [index, id] of headers.entries()) {
            const str = item[index];
            if (index === 0) {
                key = str;
                continue;
            }
            inner_item.push({ str, lang: id });
        }

        result[key] = inner_item;
    }

    return result;
}

export function encryptBl(str: string): string {
    return str.replaceAll('\n', '\\n');
}
