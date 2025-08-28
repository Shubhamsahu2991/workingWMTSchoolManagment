import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SubjectService } from '../service/subject.service';
import { AuthService } from '../../../../Service/auth.service';

@Component({
  selector: 'app-classes-with-subject',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './classes-with-subject.component.html',
  styleUrl: './classes-with-subject.component.css'
})
export class ClassesWithSubjectComponent {
SubjectData: any[] = [];   
Subjectservice = inject(SubjectService);
userservice = inject (AuthService)
 ngOnInit(): void {
  this.loadSubjectData(); // Fetch the data when the component is initialized
}
loadSubjectData(): void {
  this.Subjectservice.GetSubjectdetails().subscribe({
    next: (response) => {
      this.SubjectData = response; // Store the API response into classes
      console.log('Subject loaded successfully', this.SubjectData); // Debugging to see the output
    },
    error: (error) => {
      console.error('Error occurred while loading class data:', error);
    }
  });
}
}
