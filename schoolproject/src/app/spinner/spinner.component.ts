import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'] // Make sure your CSS styles are correct
})
export class SpinnerComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private spinnerSubscription!: Subscription;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit(): void {
    // Subscribe to spinnerStatus observable to update isLoading
    this.spinnerSubscription = this.spinnerService.spinnerStatus.subscribe(
      (status: boolean) => {
        this.isLoading = status;
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.spinnerSubscription) {
      this.spinnerSubscription.unsubscribe();
    }
  }
}
