import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    template: '',
})
export class BaseComponent implements OnDestroy {
    unsubscribe: Subject<void> = new Subject<void>();

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
