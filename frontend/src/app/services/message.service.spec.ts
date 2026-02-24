import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from './message.service';
import { environment } from '../../environments/environment';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageService],
    });
    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMessages should return messages with meta', () => {
    const mockResponse = {
      data: [{ _id: '1', phone_number: '+14155552671', body: 'Hi', status: 'sent', created_at: '2025-01-01T00:00:00Z' }],
      meta: { page: 1, per_page: 20, total: 1 },
    };

    service.getMessages(1, 20).subscribe((res) => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].body).toBe('Hi');
      expect(res.meta?.total).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/messages?page=1&per_page=20`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockResponse);
  });

  it('sendMessage should POST with message payload', () => {
    const payload = { phone_number: '+14155552671', body: 'Hello' };
    const mockResponse = {
      data: { _id: '1', phone_number: payload.phone_number, body: payload.body, status: 'queued', created_at: '2025-01-01T00:00:00Z' },
    };

    service.sendMessage(payload).subscribe((res) => {
      expect(res.data.body).toBe('Hello');
      expect(res.data.status).toBe('queued');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/messages`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ message: payload });
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockResponse);
  });
});
