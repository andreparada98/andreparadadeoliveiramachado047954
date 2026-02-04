import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from './format-date.pipe';
import { ImageUrlOrNotFoundPipe } from './image-url-or-not-found.pipe';
import { CalculateDiffInDaysPipe } from './calculate-diff-in-days.pipe';

@NgModule({
    imports: [CommonModule, FormatDatePipe, ImageUrlOrNotFoundPipe, CalculateDiffInDaysPipe],
    exports: [FormatDatePipe, ImageUrlOrNotFoundPipe, CalculateDiffInDaysPipe],
})
export class PipesModule {}
