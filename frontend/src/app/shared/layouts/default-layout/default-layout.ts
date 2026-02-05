import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { NotificationComponent } from '../../components/notification/notification';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NotificationComponent],
  templateUrl: './default-layout.html',
  styleUrl: './default-layout.scss'
})
export class DefaultLayoutComponent {}

