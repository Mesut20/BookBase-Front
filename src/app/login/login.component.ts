import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // För *ngIf
import { FormsModule } from '@angular/forms'; // För ngModel och ngForm

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(loginForm: any) {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.http.post('http://localhost:5000/api/login', { username: this.username, password: this.password }, { responseType: 'text' }).subscribe({
      next: (token) => {
        localStorage.setItem('token', token);
        this.errorMessage = '';
        this.router.navigate(['/books']);
      },
      error: (err) => {
        this.errorMessage = 'Login failed: ' + (err.error?.message || err.statusText);
        console.error('Login error:', err);
      }
    });
  }
}