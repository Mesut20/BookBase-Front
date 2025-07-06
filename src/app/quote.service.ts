import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quote } from './models';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getQuotes(): Observable<Quote[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Quote[]>(`${this.apiUrl}/quotes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  addQuote(quote: Quote): Observable<Quote> {
    const token = localStorage.getItem('token');
    return this.http.post<Quote>(`${this.apiUrl}/quotes`, quote, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteQuote(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.apiUrl}/quotes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}