import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { TestsUserComponent } from './pages/tests-user/tests-user.component';
import { StudyUserComponent } from './pages/study-user/study-user.component';
import { StatisticsUserComponent } from './pages/statistics-user/statistics-user.component';


@NgModule({
  declarations: [
    TestsUserComponent,
    StudyUserComponent,
    StatisticsUserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
