import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './models';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Book[]>(`${this.apiUrl}/books`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  addBook(book: Book): Observable<Book> {
    const token = localStorage.getItem('token');
    return this.http.post<Book>(`${this.apiUrl}/books`, book, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateBook(id: number, book: Book): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.put<void>(`${this.apiUrl}/books/${id}`, book, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  deleteBook(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    return this.http.delete<void>(`${this.apiUrl}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}