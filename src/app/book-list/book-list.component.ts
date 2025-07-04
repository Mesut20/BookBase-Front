import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Book, Quote } from '../models';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  quotes: Quote[] = [];
  errorMessage: string = '';
  isDarkMode: boolean = false;
  loading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchBooks();
    this.applyDarkMode();
  }

  fetchBooks() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please log in to view books';
      return;
    }
    this.loading = true;
    this.http.get<Book[]>('http://localhost:5000/api/books', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        this.books = response.map(book => ({ ...book, id: book.id || 0 })); // Säkerställ att id finns
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load books';
        this.loading = false;
        console.error('Error fetching books:', err);
      }
    });
  }

  fetchQuotes() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please log in to view quotes';
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

  addBook() {
    this.router.navigate(['/books/add']);
  }

  editBook(id: number) {
    console.log('Edit clicked for book ID:', id); // Felsökningslogg
    if (!id) {
      console.error('Invalid book ID:', id);
      return;
    }
    this.router.navigate([`/books/edit/${id}`]);
  }

  deleteBook(id: number) {
    console.log('Delete clicked for book ID:', id); // Felsökningslogg
    if (!id) {
      console.error('Invalid book ID:', id);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please log in to delete books';
      return;
    }
    this.loading = true;
    this.http.delete(`http://localhost:5000/api/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      () => {
        this.books = this.books.filter(b => b.id !== id);
        this.loading = false;
      },
      error => {
        this.errorMessage = 'Failed to delete book: ' + (error.error?.message || error.statusText);
        this.loading = false;
        console.error('Error deleting book:', error);
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyDarkMode() {
    const theme = this.isDarkMode ? 'dark-mode' : 'light-mode';
    document.body.className = theme;
  }
}