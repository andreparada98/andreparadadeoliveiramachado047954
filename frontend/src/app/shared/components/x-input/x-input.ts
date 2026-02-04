import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'XInput',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './x-input.html',
  styleUrl: './x-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => XInputComponent),
      multi: true,
    },
  ],
})
export class XInputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  id = input<string>(`x-input-${Math.random().toString(36).substring(2, 9)}`);

  value = signal<string>('');
  disabled = signal<boolean>(false);

  onChange: any = () => {};
  onTouched: any = () => {};

  handleInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
  }

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}

