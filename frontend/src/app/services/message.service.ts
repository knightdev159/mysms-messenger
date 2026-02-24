import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Message, PaginationMeta } from '../models/message.model';

export interface SendMessageRequest {
  phone_number: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly baseUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  getMessages(page = 1, perPage = 20): Observable<ApiResponse<Message[]>> {
    return this.http.get<ApiResponse<Message[]>>(this.baseUrl, {
      params: { page: page.toString(), per_page: perPage.toString() },
      withCredentials: true,
    });
  }

  sendMessage(data: SendMessageRequest): Observable<ApiResponse<Message>> {
    return this.http.post<ApiResponse<Message>>(
      this.baseUrl,
      { message: data },
      { withCredentials: true }
    );
  }
}
