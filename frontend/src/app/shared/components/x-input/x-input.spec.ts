import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XInputComponent } from './x-input';
import { By } from '@angular/platform-browser';

describe('XInputComponent', () => {
  let component: XInputComponent;
  let fixture: ComponentFixture<XInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(XInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();
    const labelElement = fixture.debugElement.query(By.css('label')).nativeElement;
    expect(labelElement.textContent).toContain('Test Label');
  });

  it('should update value on input event', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'new value';
    inputElement.dispatchEvent(new Event('input'));
    
    expect(component.value()).toBe('new value');
  });

  it('should call onChange when input changes', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);
    
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'changed';
    inputElement.dispatchEvent(new Event('input'));
    
    expect(spy).toHaveBeenCalledWith('changed');
  });

  it('should update internal value when writeValue is called', () => {
    component.writeValue('external value');
    expect(component.value()).toBe('external value');
  });

  it('should disable input when setDisabledState is called', () => {
    component.setDisabledState?.(true);
    fixture.detectChanges();
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.disabled).toBeTruthy();
  });
});

