import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Lägg till detta

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule], // Lägg till CommonModule här
  template: `
    <h2>Book List</h2>
    <ul>
      <li *ngFor="let book of books">{{ book.title }} (Author: {{ book.author }})</li>
    </ul>
    <p *ngIf="errorMessage">{{ errorMessage }}</p>
    <button (click)="fetchQuotes()">Show Quotes</button>
    <ul *ngIf="quotes.length > 0">
      <li *ngFor="let quote of quotes">{{ quote.quoteText }} (Author: {{ quote.author }}, Book ID: {{ quote.bookId }})</li>
    </ul>
  `,
  styles: ['p, h2 { color: blue; }', 'ul { list-style-type: none; padding: 0; }', 'button { margin-top: 10px; }']
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  quotes: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    const token = localStorage.getItem('token');
    this.http.get('http://localhost:5000/api/books', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response: any) => {
        this.books = response;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load books';
        console.error('Error fetching books:', err);
      }
    });
  }

  fetchQuotes() {
    const token = localStorage.getItem('token');
    this.http.get('http://localhost:5000/api/quotes', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response: any) => {
        this.quotes = response;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load quotes';
        console.error('Error fetching quotes:', err);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}