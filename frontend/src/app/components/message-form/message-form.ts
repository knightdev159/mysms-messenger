import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { ToastService } from '../../services/toast.service';
import { Message } from '../../models/message.model';

const MAX_BODY_LENGTH = 1600;
const E164_PATTERN = /^\+[1-9]\d{1,14}$/;

@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './message-form.html',
  styleUrl: './message-form.scss',
})
export class MessageFormComponent {
  readonly messageSent = output<Message>();
  readonly sending = signal(false);
  readonly maxBodyLength = MAX_BODY_LENGTH;

  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private toast = inject(ToastService);

  form = this.fb.nonNullable.group({
    phone_number: ['', [Validators.required, Validators.pattern(E164_PATTERN)]],
    body: ['', [Validators.required, Validators.maxLength(MAX_BODY_LENGTH)]],
  });

  get bodyLength(): number {
    return this.form.controls.body.value?.length || 0;
  }

  get bodyRemaining(): number {
    return MAX_BODY_LENGTH - this.bodyLength;
  }

  onSubmit() {
    if (this.form.invalid || this.sending()) return;

    this.sending.set(true);

    this.messageService.sendMessage(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.toast.success('Message sent successfully!');
        this.messageSent.emit(res.data);
        this.form.reset();
        this.sending.set(false);
      },
      error: () => {
        this.sending.set(false);
      },
    });
  }
}
