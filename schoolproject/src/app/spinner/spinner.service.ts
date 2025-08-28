import { Injectable } from '@angular/core';
 
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private loadingSubject = new Subject<boolean>();
  spinnerStatus = this.loadingSubject.asObservable();

  constructor() { }

  show(): void {
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }
}
