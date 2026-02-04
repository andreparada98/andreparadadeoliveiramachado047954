import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'imageUrlOrNotFound',
    pure: true,
})
export class ImageUrlOrNotFoundPipe implements PipeTransform {
    transform(value?: string): string {
        return value || 'assets/images/image-not-found.png';
    }
}
