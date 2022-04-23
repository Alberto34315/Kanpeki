import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ListWordsComponent } from './pages/list-words/list-words.component';
import { ListCategoriesComponent } from './pages/list-categories/list-categories.component';
import { ListQuestionsComponent } from './pages/list-questions/list-questions.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ListWordsComponent,
    ListCategoriesComponent,
    ListQuestionsComponent,
    ListUsersComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
