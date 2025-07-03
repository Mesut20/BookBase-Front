import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app-routing.module'; // Använder appRoutes istället för routes
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes), // Använder appRoutes
    provideHttpClient()
  ]
});