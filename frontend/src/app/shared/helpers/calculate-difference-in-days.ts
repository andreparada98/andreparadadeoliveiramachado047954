import { DAY } from './times';

export function calculateDifferenceInDays(startDate: Date, endDate: Date): number {
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = Math.round(differenceInTime / DAY);

    return differenceInDays;
}
