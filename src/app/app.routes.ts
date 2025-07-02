import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { BookListComponent } from './book-list/book-list'; // Uppdatera import

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BookListComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];