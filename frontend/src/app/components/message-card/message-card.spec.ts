import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageCardComponent } from './message-card';
import { Message } from '../../models/message.model';

describe('MessageCardComponent', () => {
  let component: MessageCardComponent;
  let fixture: ComponentFixture<MessageCardComponent>;

  const mockMessage: Message = {
    _id: '1',
    phone_number: '+14155552671',
    body: 'Test message',
    status: 'sent',
    created_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageCardComponent);
    fixture.componentRef.setInput('message', mockMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have statusLabel for sent', () => {
    expect(component.statusLabel).toBe('Sent');
  });

  it('should have statusClass including status', () => {
    expect(component.statusClass).toContain('status--');
  });
});
