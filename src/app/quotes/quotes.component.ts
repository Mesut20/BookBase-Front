import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Quote } from '../models';
import { Book } from '../models';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class QuotesComponent implements OnInit {
  quotes: Quote[] = [];
  newQuote: Quote = { id: 0, quoteText: '', author: '', bookId: 0 };
  books: Book[] = [];
  errorMessage: string = '';
  loading: boolean = false;
  isDarkMode: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchQuotes();
    this.fetchBooks();
    this.applyThemeFromStorage();
  }

  fetchQuotes() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please log in to view quotes';
      this.router.navigate(['/login']);
      return;
    }
    this.loading = true;
    this.http.get<Quote[]>('http://localhost:5000/api/quotes', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        this.quotes = response;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load quotes';
        this.loading = false;
        console.error('Error fetching quotes:', err);
      }
    });
  }

  fetchBooks() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please log in to fetch books';
      return;
    }
    this.loading = true;
    this.http.get<Book[]>('http://localhost:5000/api/books', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        this.books = response;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to fetch books';
        this.loading = false;
        console.error('Error fetching books:', err);
      }
    });
  }

  addQuote() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please log in to add quote';
      return;
    }
    this.loading = true;
    this.http.post<Quote>('http://localhost:5000/api/quotes', this.newQuote, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        this.quotes.push(response);
        this.newQuote = { id: 0, quoteText: '', author: '', bookId: 0 };
        this.loading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to add quote: ' + (err.error?.message || err.statusText);
        this.loading = false;
        console.error('Error adding quote:', err);
      }
    });
  }

  deleteQuote(id: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please log in to delete quote';
      return;
    }
    this.loading = true;
    this.http.delete(`http://localhost:5000/api/quotes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.quotes = this.quotes.filter(q => q.id !== id);
        this.loading = false;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to delete quote: ' + (err.error?.message || err.statusText);
        this.loading = false;
        console.error('Error deleting quote:', err);
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode();
    console.log('Toggling to', this.isDarkMode ? 'dark-mode' : 'light-mode'); // Felsökningslogg
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyThemeFromStorage() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyDarkMode();
  }

  private applyDarkMode() {
    const theme = this.isDarkMode ? 'dark-mode' : 'light-mode';
    document.body.className = theme;
  }
}