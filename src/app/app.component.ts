import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importera RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule], // Använd RouterModule för routning
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bookbase-front';
}