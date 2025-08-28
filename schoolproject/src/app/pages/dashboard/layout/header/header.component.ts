import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../service/sidebar.service';
import { AuthService } from '../../../../Service/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  authService = inject(AuthService)
  USERID: string  | null = null;
  sidebarService = inject(SidebarService);

  isNavbarOpen = false;

  constructor(private router: Router){

       this.authService.getUsername().subscribe(username => { this.USERID = username;  });
  }

 


  loggedInUsername = this.authService.getUsername();
 
  // get loggedIN(): boolean{
  //   return this.userService.getLoggedIn();
  // }
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


toggleNavbar() {
  this.isNavbarOpen = !this.isNavbarOpen;
}
toggleSidebar() {
  this.sidebarService.toggleSidebar(); // Call the toggle method from the service
}
}
