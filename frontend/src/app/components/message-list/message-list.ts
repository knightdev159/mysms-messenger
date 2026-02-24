import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message.model';
import { MessageCardComponent } from '../message-card/message-card';
import { MessageFormComponent } from '../message-form/message-form';

const POLL_INTERVAL_MS = 5000;

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [MessageCardComponent, MessageFormComponent],
  templateUrl: './message-list.html',
  styleUrl: './message-list.scss',
})
export class MessageListComponent implements OnInit, OnDestroy {
  private messageService = inject(MessageService);

  readonly messages = signal<Message[]>([]);
  readonly loading = signal(true);
  readonly totalMessages = signal(0);
  readonly currentPage = signal(1);
  readonly hasMore = signal(false);

  private pollTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.loadMessages();
    this.startPolling();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  private startPolling() {
    this.pollTimer = setInterval(() => this.loadMessages(false), POLL_INTERVAL_MS);
  }

  private stopPolling() {
    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  loadMessages(showLoading = true) {
    if (showLoading) this.loading.set(true);
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
