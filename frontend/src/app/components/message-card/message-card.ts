import { Component, input } from '@angular/core';
import { Message } from '../../models/message.model';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';

@Component({
  selector: 'app-message-card',
  standalone: true,
  imports: [RelativeTimePipe],
  templateUrl: './message-card.html',
  styleUrl: './message-card.scss',
})
export class MessageCardComponent {
  readonly message = input.required<Message>();

  get statusClass(): string {
    const status = this.message().status;
    return `status--${status}`;
  }

  get statusLabel(): string {
    const labels: Record<string, string> = {
      queued: 'Queued',
      sent: 'Sent',
      delivered: 'Delivered',
      failed: 'Failed',
      undelivered: 'Undelivered',
    };
    return labels[this.message().status] || this.message().status;
  }
}
