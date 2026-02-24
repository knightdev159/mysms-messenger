import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message.model';
import { MessageCardComponent } from '../message-card/message-card';
import { MessageFormComponent } from '../message-form/message-form';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [MessageCardComponent, MessageFormComponent],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageListComponent implements OnInit {
  private messageService = inject(MessageService);

  readonly messages = signal<Message[]>([]);
  readonly loading = signal(true);
  readonly totalMessages = signal(0);
  readonly currentPage = signal(1);
  readonly hasMore = signal(false);

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.loading.set(true);
    this.messageService.getMessages(this.currentPage(), 20).subscribe({
      next: (res) => {
        this.messages.set(res.data);
        this.totalMessages.set(res.meta?.total ?? 0);
        this.hasMore.set(res.data.length < (res.meta?.total ?? 0));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onMessageSent(message: Message) {
    this.messages.update((current) => [message, ...current]);
    this.totalMessages.update((t) => t + 1);
  }
}
