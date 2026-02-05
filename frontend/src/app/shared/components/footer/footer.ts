import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthService } from '../../../services/health.service';

@Component({
  selector: 'Footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent implements OnInit {
  private healthService = inject(HealthService);

  isLivenessUp = signal<boolean>(false);
  isReadinessUp = signal<boolean>(false);

  ngOnInit() {
    this.healthService.pollLiveness().subscribe(status => this.isLivenessUp.set(status));
    this.healthService.pollReadiness().subscribe(status => this.isReadinessUp.set(status));
  }
}

