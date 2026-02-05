import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XButtonComponent } from './x-button';
import { By } from '@angular/platform-browser';

describe('XButtonComponent', () => {
  let component: XButtonComponent;
  let fixture: ComponentFixture<XButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(XButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event when button is clicked', () => {
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('should not emit clicked event when button is disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    
    const spy = vi.fn();
    component.clicked.subscribe(spy);
    
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should have correct variant class', () => {
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(button.classList).toContain('x-btn-danger');
  });
});

