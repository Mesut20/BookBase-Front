import { Routes } from '@angular/router';
import { LoginComponent } from './login/login'; // Importera högst upp

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Ta bort '/books'-rutan temporärt
];