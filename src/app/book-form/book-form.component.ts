import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>{{editMode ? 'Edit Book' : 'Add Book'}}</h2>
      <form (ngSubmit)="onSubmit()" #bookForm="ngForm">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input type="text" class="form-control" id="title" [(ngModel)]="book.title" name="title" required>
        </div>
        <div class="mb-3">
          <label for="author" class="form-label">Author</label>
          <input type="text" class="form-control" id="author" [(ngModel)]="book.author" name="author" required>
        </div>
        <div *ngIf="errorMessage" class="alert alert-danger">{{errorMessage}}</div>
        <button type="submit" class="btn btn-primary" [disabled]="!bookForm.valid || !book.title || !book.author">Save</button>
        <button type="button" class="btn btn-secondary ms-2" (click)="onCancel()">Cancel</button>
      </form>
    </div>
  `,
  styles: []
})
export class BookFormComponent implements OnInit {
  book = { id: 0, title: '', author: '' };
  editMode = false;
  errorMessage: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

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
    this.http.get<any>(`http://localhost:5000/api/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => this.book = response,
      error: (err) => {
        this.errorMessage = 'Failed to load book';
        console.error('Error loading book:', err);
      }
    });
  }

  onSubmit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Please log in to save book';
      return;
    }
    if (!this.book.title || !this.book.author) {
      this.errorMessage = 'Title and Author are required';
      return;
    }
    console.log('Sending book data:', this.book); // Lägg till loggning för felsökning
    const url = this.editMode ? `http://localhost:5000/api/books/${this.book.id}` : 'http://localhost:5000/api/books';
    const method = this.editMode ? this.http.put : this.http.post;
    method.call(this.http, url, this.book, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.errorMessage = '';
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.errorMessage = 'Failed to save book: ' + (err.error?.message || err.statusText || 'Unknown error');
        console.error('Error saving book:', err);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/books']);
  }
}