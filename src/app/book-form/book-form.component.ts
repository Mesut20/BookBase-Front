import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../models';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>{{ editMode ? 'Edit Book' : 'Add Book' }}</h2>
      <form (ngSubmit)="onSubmit()" #bookForm="ngForm">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input type="text" class="form-control" id="title" [(ngModel)]="book.title" name="title" required>
        </div>
        <div class="mb-3">
          <label for="author" class="form-label">Author</label>
          <input type="text" class="form-control" id="author" [(ngModel)]="book.author" name="author" required>
        </div>
        <div class="mb-3">
          <label for="publicationDate" class="form-label">Publication Date</label>
          <input type="date" class="form-control" id="publicationDate" [(ngModel)]="publicationDate" name="publicationDate">
        </div>
        <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <button type="submit" class="btn btn-primary" [disabled]="!bookForm.valid || !book.title || !book.author">Save</button>
        <button type="button" class="btn btn-secondary ms-2" (click)="onCancel()">Cancel</button>
      </form>
    </div>
  `,
  styles: []
})
export class BookFormComponent implements OnInit {
  book: Book = { id: 0, title: '', author: '', publicationDate: undefined };
  publicationDate: string | undefined = undefined;
  editMode = false;
  errorMessage: string = '';

  constructor(private bookService: BookService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.book.id = +id;
      this.loadBook(+id);
    }
  }

  loadBook(id: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please log in to load book';
      return;
    }
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        const book = books.find(b => b.id === id);
        if (book) {
          this.book = book;
          this.publicationDate = book.publicationDate ? new Date(book.publicationDate).toISOString().split('T')[0] : undefined;
        } else {
          this.errorMessage = 'Book not found';
        }
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load book';
        console.error('Error loading book:', err);
      }
    });
  }

  onSubmit() {
    if (!this.book.title || !this.book.author) {
      this.errorMessage = 'Title and Author are required';
      return;
    }
    this.book.publicationDate = this.publicationDate ? new Date(this.publicationDate) : undefined;
    console.log('Sending book data:', this.book);
    if (this.editMode) {
      this.bookService.updateBook(this.book.id, this.book).subscribe({
        next: () => {
          this.errorMessage = '';
          this.router.navigate(['/books']);
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to save book: ' + (err.error?.message || err.statusText || 'Unknown error');
          console.error('Error saving book:', err);
        }
      });
    } else {
      this.bookService.addBook(this.book).subscribe({
        next: (response: Book) => {
          this.errorMessage = '';
          this.router.navigate(['/books']);
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to save book: ' + (err.error?.message || err.statusText || 'Unknown error');
          console.error('Error saving book:', err);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/books']);
  }
}