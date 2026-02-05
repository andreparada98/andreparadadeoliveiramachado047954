import { Component, forwardRef, input, signal, computed, ElementRef, HostListener, viewChild, effect } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  id: string;
  label: string;
}

@Component({
  selector: 'XSelectMany',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './x-select-many.html',
  styleUrl: './x-select-many.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => XSelectManyComponent),
      multi: true,
    },
  ],
})
export class XSelectManyComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('Selecione...');
  options = input<SelectOption[]>([]);
  
  searchQuery = signal('');
  isOpen = signal(false);
  selectedIds = signal<string[]>([]);
  disabled = signal(false);

  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.options().filter(opt => 
      opt.label.toLowerCase().includes(query)
    );
  });

  selectedLabels = computed(() => {
    return this.options()
      .filter(opt => this.selectedIds().includes(opt.id))
      .map(opt => opt.label)
      .join(', ');
  });

  onChange: any = () => {};
  onTouched: any = () => {};

  toggleDropdown() {
    if (!this.disabled()) {
      this.isOpen.set(!this.isOpen());
    }
  }

  toggleOption(optionId: string) {
    const current = this.selectedIds();
    const index = current.indexOf(optionId);
    let newVal: string[];
    
    if (index === -1) {
      newVal = [...current, optionId];
    } else {
      newVal = current.filter(id => id !== optionId);
    }
    
    this.selectedIds.set(newVal);
    this.onChange(newVal);
  }

  isSelected(optionId: string): boolean {
    return this.selectedIds().includes(optionId);
  }

  writeValue(value: string[]): void {
    this.selectedIds.set(value || []);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.select-many-container')) {
      this.isOpen.set(false);
    }
  }
}

