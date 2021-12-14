import dayjs from 'dayjs';
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
