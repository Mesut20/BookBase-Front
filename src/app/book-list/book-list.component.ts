import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book, Quote } from '../models';
import { BookService } from '../book.service';
import { QuoteService } from '../quote.service';
import { Router } from '@angular/router';

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

  constructor(private bookService: BookService, private quoteService: QuoteService, private router: Router) {}

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
    this.bookService.getBooks().subscribe({
      next: (response: Book[]) => {
        this.books = response.map(book => ({ ...book, id: book.id || 0 }));
        this.loading = false;
        if (!response.length) {
          this.errorMessage = 'No books found. Add a new book to get started!';
        }
      },
      error: (err: any) => {
        this.errorMessage = err.status === 404 ? 'No books found. Add a new book to get started!' : 'Failed to load books';
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
    this.quoteService.getQuotes().subscribe({
      next: (response: Quote[]) => {
        this.quotes = response;
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.status === 404 ? 'No quotes found.' : 'Failed to load quotes';
        this.loading = false;
        console.error('Error fetching quotes:', err);
      }
    });
  }

  addBook() {
    this.router.navigate(['/books/add']);
  }

  editBook(id: number) {
    console.log('Edit clicked for book ID:', id);
    if (!id) {
      console.error('Invalid book ID:', id);
      return;
    }
    this.router.navigate([`/books/edit/${id}`]);
  }

  deleteBook(id: number) {
    console.log('Delete clicked for book ID:', id);
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
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.books = this.books.filter(b => b.id !== id);
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to delete book: ' + (err.error?.message || err.statusText);
        this.loading = false;
        console.error('Error deleting book:', err);
      }
    });
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