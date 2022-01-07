import { exportIntl } from './export';
import { importIntl } from './import';

function main() {
    if (process.env.type === 'export') {
        exportIntl();
    } else if (process.env.type === 'import') {
        const file_name = process.argv[2];
        importIntl(file_name);
    }
}

main();
