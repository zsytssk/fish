import { exportIntl } from './export';
import { importIntl } from './import';

async function main() {
    console.time(`time:${process.env.type}:>`);
    if (process.env.type === 'export') {
        await exportIntl();
    } else if (process.env.type === 'import') {
        const file_name = process.argv[2];
        await importIntl(file_name);
    }
    console.timeEnd(`time:${process.env.type}:>`);
}

main();
