import { Component, inject } from '@angular/core';
 
import { SpinnerService } from './spinner/spinner.service';
import { CommonModule } from '@angular/common';
 
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from "./spinner/spinner.component";
import { WelcomeloadComponent } from "./pages/welcomeload/welcomeload.component";
   // Import the SpinnerService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SpinnerComponent, WelcomeloadComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title: any;

welcomeshow: boolean = true;   

ngOnInit(): void {
  // After 3 seconds, set welcomeshow to false to hide the welcome component
  setTimeout(() => {
    this.welcomeshow = false;  // Hide the welcome screen
  }, 1000); // 3000 milliseconds = 3 seconds
}



 
}
