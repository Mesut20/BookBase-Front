import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { BookListComponent } from './book-list/book-list';
import { QuotesComponent } from './quotes/quotes.component'; // Lägg till denna import

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BookListComponent },
  { path: 'quotes', component: QuotesComponent }, // Nu är komponenten importerad
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  // Exportera routes om det behövs i andra filer
  static forRoot() {
    return { ngModule: AppRoutingModule, providers: [] };
  }
}

// Exportera routes separat om det används i app.config.ts eller main.ts
export const appRoutes = routes;