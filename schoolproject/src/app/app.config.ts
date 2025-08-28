import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';  // Import your routes file
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

export const appConfig: ApplicationConfig = {
  providers: [
    NgxSpinnerModule,
    provideHttpClient(withFetch()),                          // HTTP client
    provideRouter(routes),                                    // Router for navigation
    provideZoneChangeDetection({ eventCoalescing: true }),    // Zone change detection
    provideClientHydration(),                                 // Client-side hydration (optional)
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
    
  ]
};
