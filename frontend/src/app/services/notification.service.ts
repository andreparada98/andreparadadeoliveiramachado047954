import { Injectable, signal } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { environment } from '../../environments/environment';

export interface AppNotification {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private client: Client;
  notifications = signal<AppNotification[]>([]);

  constructor() {
    const wsUrl = environment.apiUrl.replace('http', 'ws');
    this.client = new Client({
      brokerURL: `${wsUrl}/ws-notifications`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/albums', (message) => {
        if (message.body) {
          const album = JSON.parse(message.body);
          this.addNotification(`Novo álbum cadastrado: ${album.title}`);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error', frame);
    };

    this.client.activate();
  }

  private addNotification(message: string) {
    const id = Date.now();
    this.notifications.update(prev => [...prev, { id, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(id);
    }, 5000);
  }

  removeNotification(id: number) {
    this.notifications.update(prev => prev.filter(n => n.id !== id));
  }
}

