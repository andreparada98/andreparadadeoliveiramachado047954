import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'sort' | 'outline' | 'danger';

@Component({
  selector: 'XButton',
  standalone: true,
  templateUrl: './x-button.html',
  styleUrl: './x-button.scss'
})
export class XButtonComponent {
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  
  clicked = output<MouseEvent>();

  handleClick(event: MouseEvent) {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}

