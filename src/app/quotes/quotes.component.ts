import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Quote, Book } from '../models';
import { QuoteService } from '../quote.service';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

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

  constructor(private quoteService: QuoteService, private bookService: BookService, private router: Router) {}

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
    this.quoteService.getQuotes().subscribe({
      next: (response: Quote[]) => {
        this.quotes = response;
        this.loading = false;
        if (!response.length) {
          this.errorMessage = 'No quotes found. Add a new quote to get started!';
        }
      },
      error: (err: any) => {
        this.errorMessage = err.status === 404 ? 'No quotes found. Add a new quote to get started!' : 'Failed to load quotes';
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
    this.bookService.getBooks().subscribe({
      next: (response: Book[]) => {
        this.books = response;
        this.loading = false;
        if (!response.length) {
          this.errorMessage = 'No books found. Add a book first!';
        }
      },
      error: (err: any) => {
        this.errorMessage = err.status === 404 ? 'No books found. Add a book first!' : 'Failed to fetch books';
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
    if (!this.newQuote.quoteText || !this.newQuote.author || !this.newQuote.bookId) {
      this.errorMessage = 'Quote text, author, and book ID are required';
      return;
    }
    this.loading = true;
    this.quoteService.addQuote(this.newQuote).subscribe({
      next: (response: Quote) => {
        this.quotes.push(response);
        this.newQuote = { id: 0, quoteText: '', author: '', bookId: 0 };
        this.loading = false;
        this.errorMessage = '';
      },
      error: (err: any) => {
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
    this.quoteService.deleteQuote(id).subscribe({
      next: () => {
        this.quotes = this.quotes.filter(q => q.id !== id);
        this.loading = false;
        this.errorMessage = '';
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to delete quote: ' + (err.error?.message || err.statusText);
        this.loading = false;
        console.error('Error deleting quote:', err);
      }
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyDarkMode();
    console.log('Toggling to', this.isDarkMode ? 'dark-mode' : 'light-mode');
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