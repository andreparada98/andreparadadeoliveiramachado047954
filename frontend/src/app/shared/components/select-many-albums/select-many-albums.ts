import { Component, forwardRef, inject, input, signal, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlbumService } from '../../../services/album.service';
import { XSelectManyComponent, SelectOption } from '../x-select-many/x-select-many';

@Component({
  selector: 'XSelectManyAlbums',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, XSelectManyComponent],
  template: `
    <XSelectMany
      [label]="label()"
      [placeholder]="placeholder()"
      [options]="albumOptions()"
      [ngModel]="value()"
      (ngModelChange)="onValueChange($event)"
      [disabled]="disabled()"
    ></XSelectMany>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectManyAlbumsComponent),
      multi: true,
    },
  ],
})
export class SelectManyAlbumsComponent implements ControlValueAccessor, OnInit {
  label = input<string>('Álbuns');
  placeholder = input<string>('Selecione os álbuns...');

  private albumService = inject(AlbumService);
  
  albumOptions = signal<SelectOption[]>([]);
  value = signal<string[]>([]);
  disabled = signal(false);

  onChange: any = () => {};
  onTouched: any = () => {};

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.albumService.getAlbums({}, 0, 100).subscribe({
      next: (response) => {
        const options = response.content.map(a => ({ id: a.id, label: a.title }));
        this.albumOptions.set(options);
      },
      error: (err) => {
        console.error('Error fetching albums for SelectManyAlbums:', err);
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

