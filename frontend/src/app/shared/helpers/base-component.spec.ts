import { TestBed } from '@angular/core/testing';
import { BaseComponent } from './base-component';

describe('BaseComponent', () => {
  let component: BaseComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [BaseComponent]
    });
    component = new BaseComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit and complete unsubscribe subject on destroy', () => {
    const nextSpy = vi.spyOn(component.unsubscribe, 'next');
    const completeSpy = vi.spyOn(component.unsubscribe, 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});

