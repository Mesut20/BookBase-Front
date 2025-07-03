import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
   const credentials = { username: this.username, password: this.password };
  this.http.post('http://localhost:5000/api/auth/login', credentials)
    .subscribe({
      next: (response: any) => {
        console.log('Server response:', JSON.stringify(response, null, 2));
        console.log('Token check:', {
          hasResponse: !!response,
          isObject: typeof response === 'object',
          hasToken: !!response.token,
          isString: typeof response.token === 'string',
          startsWithEy: response.token && response.token.startsWith('ey')
        });
        if (response && typeof response === 'object' && response.token && typeof response.token === 'string' && response.token.startsWith('ey')) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/books']);
        } else {
          this.errorMessage = 'Ogiltig token från server';
        }
      },
      error: (err) => {
        this.errorMessage = 'Inloggning misslyckades';
        console.error('Error:', err);
      }
    });
  }
}