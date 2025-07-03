import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Lägg till för *ngIf och *ngFor

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css'],
  standalone: true, // Gör komponenten standalone
  imports: [CommonModule] // Importera CommonModule för directives
})
export class QuotesComponent implements OnInit {
  quotes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, redirect to login if implemented');
      return;
    }

    this.http.get<any[]>('http://localhost:5000/api/quotes', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      data => this.quotes = data,
      error => console.error('Error fetching quotes:', error)
    );
  }
}