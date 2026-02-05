import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XModalComponent } from './x-modal';
import { By } from '@angular/platform-browser';

describe('XModalComponent', () => {
  let component: XModalComponent;
  let fixture: ComponentFixture<XModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(XModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    fixture.componentRef.setInput('title', 'Modal Title');
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(titleElement.textContent).toContain('Modal Title');
  });

  it('should emit close event when close button is clicked', () => {
    const spy = vi.fn();
    component.close.subscribe(spy);
    
    const closeBtn = fixture.debugElement.query(By.css('.close-btn')).nativeElement;
    closeBtn.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should emit close event when backdrop is clicked', () => {
    const spy = vi.fn();
    component.close.subscribe(spy);
    
    const backdrop = fixture.debugElement.query(By.css('.modal-backdrop')).nativeElement;
    backdrop.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit close event when modal container is clicked', () => {
    const spy = vi.fn();
    component.close.subscribe(spy);
    
    const container = fixture.debugElement.query(By.css('.modal-container')).nativeElement;
    container.click();
    
    expect(spy).not.toHaveBeenCalled();
  });
});

