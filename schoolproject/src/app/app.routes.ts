import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/dashboard/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; 
import { AllclassComponent } from './pages/Component/class/allclass/allclass.component';
import { NewclassComponent } from './pages/Component/class/newclass/newclass.component';
  import { AssignSubjectComponent } from './pages/Component/Subject/assign-subject/assign-subject.component';
  import { ClassesWithSubjectComponent } from './pages/Component/Subject/classes-with-subject/classes-with-subject.component';
import { AddmissionletterComponent } from './pages/Component/Student/addmissionletter/addmissionletter.component';
import { AllstudentComponent } from './pages/Component/Student/allstudent/allstudent.component';
import { AddnewComponent } from './pages/Component/Student/addnew/addnew.component';
import { ManageloginComponent } from './pages/Component/Student/managelogin/managelogin.component';
import { PrintbasiclistComponent } from './pages/Component/Student/printbasiclist/printbasiclist.component';
import { PromotestudentComponent } from './pages/Component/Student/promotestudent/promotestudent.component';
import { StudentIDcardsComponent } from './pages/Component/Student/student-idcards/student-idcards.component';
import { EditStudentComponent } from './pages/Component/Student/EditStudent/edit-student/edit-student.component';
import { LoginprofileComponent } from './pages/login/loginprofile/loginprofile.component';
import { ProfilesettingComponent } from './pages/login/profilesetting/profilesetting.component';
import { CreateuserComponent } from './pages/login/createuser/createuser.component';
import { authGuard } from './guard/auth.guard';
import { GameComponent } from './game/game.component';
import { QuizComponent } from './game/quiz/quiz.component';
import { DrawingBoardComponent } from './game/drawing-board/drawing-board.component';



export const routes: Routes = [
    { path: '', component: HomeComponent }, // Home page
    { path: 'login', component: LoginComponent  }, // Login page
    { path: 'create', component: CreateuserComponent },   
    { path: 'game', component: GameComponent }, 
     { path: 'Quiz', component: QuizComponent },  
      { path: 'DrawingBoard', component: DrawingBoardComponent },   

  {
    path: '', component: LayoutComponent, children: [
        { path: 'Dashboard', component: DashboardComponent , canActivate: [authGuard] , data: { role: 'School' } },

        //class component
        { path: 'Allclass', component:AllclassComponent,data: { title: 'Class | All Class' } },
        { path: 'newclass', component:NewclassComponent, data: { title: 'Class | New Class ' }},
        

        //subject component
        { path: 'Classeswithsubjects', component:ClassesWithSubjectComponent, data: { title: 'subject | Classes with subjects' } },
        { path: 'AssignSubjects', component:AssignSubjectComponent, data: { title: 'subject | Assign Subjects' } },

        //student component
        { path: 'Addmissionletter', component:AddmissionletterComponent, data: { title: 'Student | Addmission letter' }},
        { path: 'Addnew', component:AddnewComponent, data: { title: 'Student | Add New' }},
        { path: 'Allstudent', component:AllstudentComponent, data: { title: 'Student | Allstudent' }},
        { path: 'Managelogin', component:ManageloginComponent , data: { title: 'Student | Manage login' }},
        { path: 'Printbasiclist', component:PrintbasiclistComponent, data: { title: 'Student | Print basic list' }},
        { path: 'Promotestudent', component:PromotestudentComponent , data: { title: 'Student | Promote student' }},
        { path: 'StudentIDcards', component:StudentIDcardsComponent, data: { title: 'Student |Student ID cards' }},
        { path: 'edit/:id', component: EditStudentComponent , data: { title: 'Student | edit ' }},

        { path: 'loginprofile', component: LoginprofileComponent },
        { path: 'profilesetting', component: ProfilesettingComponent },
        
      
       
         
    ]
},

  { path: '**', redirectTo: '' }, // Redirect to home for any unknown routes

 
];
