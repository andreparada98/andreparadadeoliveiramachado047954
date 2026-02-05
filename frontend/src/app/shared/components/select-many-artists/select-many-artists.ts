import { Component, forwardRef, inject, input, signal, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ArtistService } from '../../../services/artist.service';
import { XSelectManyComponent, SelectOption } from '../x-select-many/x-select-many';

@Component({
  selector: 'XSelectManyArtists',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, XSelectManyComponent],
  template: `
    <XSelectMany
      [label]="label()"
      [placeholder]="placeholder()"
      [options]="artistOptions()"
      [ngModel]="value()"
      (ngModelChange)="onValueChange($event)"
      [disabled]="disabled()"
    ></XSelectMany>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectManyArtistsComponent),
      multi: true,
    },
  ],
})
export class SelectManyArtistsComponent implements ControlValueAccessor, OnInit {
  label = input<string>('Artistas');
  placeholder = input<string>('Selecione os artistas...');

  private artistService = inject(ArtistService);
  
  artistOptions = signal<SelectOption[]>([]);
  value = signal<string[]>([]);
  disabled = signal(false);

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit() {
    this.loadArtists();
  }

  loadArtists() {
    this.artistService.getArtists({}, 0, 100).subscribe({
      next: (response) => {
        const options = response.content.map(a => ({ id: a.id, label: a.name }));
        this.artistOptions.set(options);
      },
      error: (err) => {
        console.error('Error fetching artists for SelectManyArtists:', err);
      }
    });
  }

  onValueChange(newValue: string[]) {
    this.value.set(newValue);
    this.onChange(newValue);
  }

  writeValue(value: string[]): void {
    this.value.set(value || []);
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
}

