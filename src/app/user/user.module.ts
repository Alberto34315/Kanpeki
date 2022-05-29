import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { TestsUserComponent } from './pages/tests-user/tests-user.component';
import { StudyUserComponent } from './pages/study-user/study-user.component';
import { StatisticsUserComponent } from './pages/statistics-user/statistics-user.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MainComponent } from './pages/main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminModule } from '../admin/admin.module';

@NgModule({
  declarations: [
    TestsUserComponent,
    StudyUserComponent,
    StatisticsUserComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,   
    AdminModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule, 
  ]
})
export class UserModule { }
