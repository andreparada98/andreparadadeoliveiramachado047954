import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (notification of notifications(); track notification.id) {
        <div class="notification-item">
          <span class="message">{{ notification.message }}</span>
          <button (click)="remove(notification.id)" class="close-btn">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .notification-item {
      background: #333;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 250px;
      animation: slideIn 0.3s ease-out;
    }
    .message {
      font-size: 0.9rem;
    }
    .close-btn {
      background: none;
      border: none;
      color: #aaa;
      font-size: 1.2rem;
      cursor: pointer;
      margin-left: 10px;
      &:hover {
        color: white;
      }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  notifications = this.notificationService.notifications;

  remove(id: number) {
    this.notificationService.removeNotification(id);
  }
}

