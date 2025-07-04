import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BookListComponent } from './book-list/book-list.component';
import { QuotesComponent } from './quotes/quotes.component';
import { BookFormComponent } from './book-form/book-form.component';
import { authGuard } from './auth.guard'; // Importera guarden

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BookListComponent, canActivate: [authGuard] },
  { path: 'quotes', component: QuotesComponent, canActivate: [authGuard] },
  { path: 'books/add', component: BookFormComponent, canActivate: [authGuard] },
  { path: 'books/edit/:id', component: BookFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

export const appRoutes = routes;