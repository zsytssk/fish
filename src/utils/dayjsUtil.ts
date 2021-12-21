import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function formatDateTime(time: number, format = 'YYYY/MM/DD') {
    return dayjs(time).format(format);
}
export function formatDateRange(range: LocalRange, format = 'MM/DD') {
    const start = dayjs(range[0]).utc().format(format);
    const end = dayjs(range[1]).utc().format(format);
    return `${start}-${end}`;
}
export function getMonthDateList() {
    const now = Date.now();

    const arr: Dayjs[] = [];
    for (let i = 1; i <= 30; i++) {
        const item = dayjs(now).subtract(i, 'day');
        arr.push(item);
    }

    return arr;
}
