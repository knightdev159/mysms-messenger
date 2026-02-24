import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageFormComponent } from './message-form';
import { MessageService } from '../../services/message.service';
import { ToastService } from '../../services/toast.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('MessageFormComponent', () => {
  let component: MessageFormComponent;
  let fixture: ComponentFixture<MessageFormComponent>;
  let sendMessageSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    sendMessageSpy = vi.fn().mockReturnValue(
      of({ data: { _id: '1', phone_number: '+14155552671', body: 'Hi', status: 'queued', created_at: '' } })
    );
    const mockToastService = { success: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [MessageFormComponent],
      providers: [
        { provide: MessageService, useValue: { sendMessage: sendMessageSpy } },
        { provide: ToastService, useValue: mockToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('form should be valid with E.164 phone and body', () => {
    component.form.patchValue({
      phone_number: '+14155552671',
      body: 'Hello',
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('bodyRemaining should decrease as body length increases', () => {
    expect(component.bodyRemaining).toBe(1600);
    component.form.patchValue({ body: 'Hi' });
    expect(component.bodyRemaining).toBe(1598);
  });

  it('onSubmit should call MessageService.sendMessage when form valid', () => {
    component.form.patchValue({ phone_number: '+14155552671', body: 'Hi' });
    component.onSubmit();
    expect(sendMessageSpy).toHaveBeenCalledWith({ phone_number: '+14155552671', body: 'Hi' });
  });
});
