import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../service/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  sidebarService = inject(SidebarService);
  isSidebarOpen: boolean = false;

  constructor( ) {}

  ngOnInit() {
    this.sidebarService.getSidebarState().subscribe(state => {
      this.isSidebarOpen = state; // Update the local state based on the service
    });
  }

  openSubmenu: string | null = null;  // Keeps track of which submenu is open

  // Toggle function to show/hide submenus
  toggleMenu(menu: string): void {
    // If the clicked submenu is already open, close it
    if (this.openSubmenu === menu) {
      this.openSubmenu = null;
    } else {
      this.openSubmenu = menu;
    }
  }


}
