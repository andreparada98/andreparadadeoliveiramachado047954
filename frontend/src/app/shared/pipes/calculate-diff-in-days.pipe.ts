import { Pipe, PipeTransform } from '@angular/core';
import { calculateDifferenceInDays } from '../helpers/calculate-difference-in-days';

@Pipe({
    name: 'calculateDiffInDays',
})
export class CalculateDiffInDaysPipe implements PipeTransform {
    transform(startDate?: Date, endDate?: Date): number {
        if (!startDate) return 0;

        const end = endDate ? new Date(endDate) : new Date();
        return calculateDifferenceInDays(new Date(startDate), end);
    }
}
