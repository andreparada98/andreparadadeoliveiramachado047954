import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XSelectManyComponent } from './x-select-many';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('XSelectManyComponent', () => {
  let component: XSelectManyComponent;
  let fixture: ComponentFixture<XSelectManyComponent>;

  const mockOptions = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Other Option' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XSelectManyComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(XSelectManyComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown', () => {
    component.toggleDropdown();
    expect(component.isOpen()).toBeTruthy();
    component.toggleDropdown();
    expect(component.isOpen()).toBeFalsy();
  });

  it('should filter options based on searchQuery', () => {
    component.searchQuery.set('Other');
    fixture.detectChanges();
    expect(component.filteredOptions().length).toBe(1);
    expect(component.filteredOptions()[0].label).toBe('Other Option');
  });

  it('should toggle option selection', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);
    
    component.toggleOption('1');
    expect(component.selectedIds()).toEqual(['1']);
    expect(spy).toHaveBeenCalledWith(['1']);
    
    component.toggleOption('1');
    expect(component.selectedIds()).toEqual([]);
    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should display selected labels correctly', () => {
    component.selectedIds.set(['1', '2']);
    fixture.detectChanges();
    expect(component.selectedLabels()).toBe('Option 1, Option 2');
  });

  it('should close dropdown on outside click', () => {
    component.isOpen.set(true);
    const mockEvent = {
      target: {
        closest: (selector: string) => null
      }
    } as any;
    component.onDocumentClick(mockEvent);
    expect(component.isOpen()).toBeFalsy();
  });
});

