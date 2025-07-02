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
          console.log('Server response:', response);
          const token = response.token; // Extrahera token från JSON
          if (token && token.startsWith('ey')) {
            localStorage.setItem('token', token);
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