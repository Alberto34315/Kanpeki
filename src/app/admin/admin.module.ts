import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ListWordsComponent } from './pages/list-words/list-words.component';
import { ListCategoriesComponent } from './pages/list-categories/list-categories.component';
import { ListQuestionsComponent } from './pages/list-questions/list-questions.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { SharedModule } from '../shared/shared.module';
import { FormUsersComponent } from './components/form-users/form-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormCategoriesComponent } from './components/form-categories/form-categories.component';
import { FormQuestionsComponent } from './components/form-questions/form-questions.component';
import { FormWordsComponent } from './components/form-words/form-words.component';
import { TranslateModule } from '@ngx-translate/core';
import { MainComponent } from './pages/main/main.component';

@NgModule({
  declarations: [
    ListWordsComponent,
    ListCategoriesComponent,
    ListQuestionsComponent,
    ListUsersComponent,
    StatisticsComponent,
    FormUsersComponent,
    FormCategoriesComponent,
    FormQuestionsComponent,
    FormWordsComponent,
    MainComponent
  ],
  exports:[
    FormUsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,    
    TranslateModule,
    
  ]
})
export class AdminModule { }
