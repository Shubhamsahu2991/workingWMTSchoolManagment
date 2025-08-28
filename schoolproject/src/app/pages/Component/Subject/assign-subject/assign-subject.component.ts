import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from 'express';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from '../service/subject.service';
import { NewclassService } from '../../class/service/newclass.service';
import { Getclassdetails } from '../../class/model/class';
import { CommonModule } from '@angular/common';
import { Subject } from '../Modal/subjectclas';
import { AuthService } from '../../../../Service/auth.service';

@Component({
  selector: 'app-assign-subject',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './assign-subject.component.html',
  styleUrl: './assign-subject.component.css'
})
export class AssignSubjectComponent implements OnInit {
  addsubjectform!: FormGroup;
  toastr = inject(ToastrService);
  Subjectservice = inject(SubjectService);
  requestedData: any;
  classes: Getclassdetails[] = [];
  USERID: string  | null = null;
  authService = inject(AuthService)
  constructor(private fb: FormBuilder, private newClassService: NewclassService) {
     this.authService.getUsername().subscribe(username => { this.USERID = username;  });
    this.createForm();
  }

  ngOnInit(): void {
    
    this.loadClassData(); // Fetch the data when the component is initialized
  }

  // Method to load class data from API
  loadClassData(): void {

    if (this.USERID) {
      this.newClassService.Getclassdetails(this.USERID).subscribe({
        next: (response) => {
          this.classes = response; // Store the API response into classes
          console.log('Classes loaded successfully', this.classes); // Debugging to see the output
        },
        error: (error) => {
          console.error('Error occurred while loading class data:', error);
        }
      });
    } else {
      console.error('USER_ID is null. Cannot load class data.');
    }
  }

  get subjects() {
    return (this.addsubjectform.get('subjects') as FormArray);
  }

  private createForm(): void {
    this.addsubjectform = this.fb.group({
      classname: ['', Validators.required],
      SCHOOL_ID: [this.USERID],
      subjects: this.fb.array([this.createSubject()])  // Initialize the FormArray with 1 subject
       
    });
  }

  // Create a new subject row
  createSubject(): FormGroup {
    return this.fb.group({
      Subjectname: ['', Validators.required],
      SCHOOL_ID: [this.USERID],
      subjectmarks: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]]
    });
  }

  // Add a new subject row
  addSubject() {
    this.subjects.push(this.createSubject());
  }

  // Remove the last subject row
  removeSubject() {
    if (this.subjects.length > 1) {
      this.subjects.removeAt(this.subjects.length - 1);
    }
  }

  // Handle form submission
  onSubmit() {
    if (this.addsubjectform.valid) {
      const formData = this.addsubjectform.value;

      // Prepare the subjects array with classID and submit data
      const subjectsToSubmit: Subject[] = formData.subjects.map((subject: any) => ({
        subjectname: subject.Subjectname,
        SCHOOL_ID: subject.SCHOOL_ID,
        subjectmarks: subject.subjectmarks,
        classID: formData.classname // classID from the selected class
      }));

      // Send data to the backend API
      this.Subjectservice.addSubjects({ subjects: subjectsToSubmit }).subscribe(
        (response) => {
          console.log('Subjects added successfully', response);
          this.toastr.success('Subjects added successfully!');
          this.addsubjectform.reset(); // Reset the form after successful submission
        },
        (error) => {
          console.error('Error adding subjects', error);
          this.toastr.error('Error adding subjects.');
        }
      );
    } else {
      console.log('Form is invalid');
      this.toastr.error('Please fill in all required fields.');
    }
  }
}